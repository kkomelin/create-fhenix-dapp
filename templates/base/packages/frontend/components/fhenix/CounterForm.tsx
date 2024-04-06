import { BeakerIcon } from "@heroicons/react/24/outline";
import { BrowserProvider, Eip1193Provider, JsonRpcProvider, ethers } from "ethers";
import { EncryptionTypes, FhenixClient } from "fhenixjs";
import { useEffect, useRef, useState } from "react";
import { useNetwork } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead, useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";
import { IntegerInput } from "../scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<string | bigint>(0n);
  const [counterValue, setCounterValue] = useState<number>();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider | null>(null);
  const fhenixClient = useRef<FhenixClient | null>(null);
  const { chain: connectedChain } = useNetwork();
  const { data: deployedContractData, isLoading: isDeployedContractLoading } = useDeployedContractInfo(CONTRACT_NAME);
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  const { data: sealedCounterValue, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  const [isAddValueLoading, setIsAddValueLoading] = useState<boolean>(false);

  let addResult = null;

  // const {
  //   data: addResult,
  //   writeAsync: addValue,
  //   isLoading: isAddValueLoading,
  // } = useScaffoldContractWrite({
  //   contractName: CONTRACT_NAME,
  //   functionName: "add",
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  /**
   * @todo: Switch to useScaffoldContractWrite() or such.
   *
   *
   * @param amount
   * @returns
   */
  async function addValue(amount: number) {
    const provider = getFhenixProvider();
    if (provider == null) {
      notification.error("No provider found");
      throw new Error("No provider found");
    }

    const client = getFhenixClient();
    if (client == null) {
      notification.error("No FHE client found");
      throw new Error("No FHE client found");
    }

    if (deployedContractData?.address == null) {
      notification.error("Cannot find the deployed contract");
      throw new Error("Cannot find the deployed contract");
    }

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(deployedContractData?.address, deployedContractData?.abi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer); // as Counter;

    const encryptedAmount = await encryptNumber(amount);

    const tx = await contractWithSigner.add(encryptedAmount);
    return await tx.wait();
  }

  const handleWrite = async () => {
    if (addValue == null) {
      return;
    }

    const value = Number(newValue);

    if (value === 0) {
      notification.warning("The value should not be 0");
      return;
    }

    try {
      // const encryptedNumber = await encryptNumber(Number(newValue));
      // console.log(encryptedNumber);
      setIsAddValueLoading(true);
      // () => addValue({ args: [encryptedNumber] });
      await writeTxn(() => addValue(value));
    } catch (e: any) {
      console.error("⚡️ ~ file: CounterForm.tsx:handleWrite ~ error", e);
    } finally {
      setIsAddValueLoading(false);
    }
  };

  const getFhenixProvider = () => {
    if (fhenixProvider.current != null) {
      return fhenixProvider.current;
    }

    // Initialize the provider.
    // @todo: Find a way not to use ethers.BrowserProvider because we already have viem and wagmi here.
    fhenixProvider.current = new BrowserProvider(window.ethereum as Eip1193Provider);

    return fhenixProvider.current;
  };

  const getFhenixClient = () => {
    if (fhenixClient.current != null) {
      return fhenixClient.current;
    }

    const provider = getFhenixProvider();

    fhenixClient.current = new FhenixClient({ provider });
    return fhenixClient.current;
  };

  const encryptNumber = async (value: number) => {
    const client = getFhenixClient();
    // Encrypt data for a Fhenix contract.
    return await client.encrypt(value, EncryptionTypes.uint8);
  };

  const unsealValue = (contractAddress: string, sealedValue: string) => {
    // const client = getFhenixClient();
    // Unseal value before displaying it.
    // return client.unseal(contractAddress, sealedValue);
    return sealedValue;
  };

  useEffect(() => {
    if (isDeployedContractLoading || deployedContractData?.address == null) {
      return;
    }

    // Unseal value before displaying it if necessary.
    const clearedValue = unsealValue(deployedContractData?.address, sealedCounterValue);

    // @todo: Use bigint for large values.
    setCounterValue(Number(clearedValue));
  }, [sealedCounterValue, isDeployedContractLoading]);

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <div className="flex flex-col justify-center items-center">
        <BeakerIcon className="h-8 w-8 fill-secondary" />
        <p>Counter demo</p>
      </div>

      {isTotalCounterLoading && <div>Loading</div>}

      <div className="p-2">{counterValue || 0}</div>

      <div className="py-5 space-y-3 first:pt-0 last:pb-1">
        <div className="flex gap-3 flex-col">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">add to counter</span>
              <span className="block text-xs font-extralight leading-none">num</span>
            </div>
            <IntegerInput
              value={newValue}
              onChange={updatedTxValue => {
                setNewValue(updatedTxValue);
              }}
              placeholder="number"
              disableMultiplyBy1e18={true}
              disabled={isAddValueLoading}
            />
          </div>

          <div className="flex justify-between gap-2">
            <div
              className={`flex ${
                writeDisabled &&
                "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
              }`}
              data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
            >
              <button
                className="btn btn-secondary btn-sm"
                disabled={writeDisabled || isAddValueLoading}
                onClick={handleWrite}
              >
                {isAddValueLoading && <span className="loading loading-spinner loading-xs"></span>}
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterForm;
