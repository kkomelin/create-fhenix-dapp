import { BeakerIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useState } from "react";
import { useNetwork } from "wagmi";
import useFhenix from "~~/hooks/fhenix/useFhenix";
import { useDeployedContractInfo, useScaffoldContractRead, useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";
import { IntegerInput } from "../scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<string | bigint>(0n);
  const { chain: connectedChain } = useNetwork();
  const { data: deployedContractData } = useDeployedContractInfo(CONTRACT_NAME);
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const { fhenixClient, fhenixProvider } = useFhenix();

  const { data: counterValue, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  const [isAddValueLoading, setIsAddValueLoading] = useState<boolean>(false);

  /**
   * @todo: Switch to useScaffoldContractWrite() or such.
   *
   *
   * @param value
   * @returns
   */
  async function addValueEthers(value: number) {
    if (fhenixProvider == null) {
      notification.error("No provider found");
      throw new Error("No provider found");
    }

    if (fhenixClient == null) {
      notification.error("No FHE client found");
      throw new Error("No FHE client found");
    }

    if (deployedContractData?.address == null) {
      notification.error("Cannot find the deployed contract");
      throw new Error("Cannot find the deployed contract");
    }

    const signer = await fhenixProvider.getSigner();

    const contract = new ethers.Contract(deployedContractData?.address, deployedContractData?.abi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer); // as Counter;

    // Encrypt numeric value to be passed into the Fhenix-powered contract.
    const encryptedValue = await fhenixClient.encrypt_uint8(value);

    const tx = await contractWithSigner.add(encryptedValue);
    return await tx.wait();
  }

  // async function addValueViem(value: number) {
  //   if (deployedContractData?.address == null) {
  //     return;
  //   }

  //   if (fhenixClient == null) {
  //     return;
  //   }

  //   const publicClient = createPublicClient({
  //     chain: fhenixLocal,
  //     transport: http(),
  //   });

  //   const walletClient = createWalletClient({
  //     chain: fhenixLocal,
  //     transport: custom(window.ethereum!),
  //   });

  //   const [account] = await walletClient.getAddresses();

  //   const param = await prepareArg(value);

  //   const { request } = await publicClient.simulateContract({
  //     account,
  //     address: deployedContractData?.address,
  //     abi: deployedContractData?.abi,
  //     functionName: "add",
  //     args: [param],
  //   });
  //   return await walletClient.writeContract(request);
  // }

  // const prepareArg = async (value: number) => {
  //   if (fhenixClient == null) {
  //     notification.error("No FHE client found");
  //     throw new Error("No FHE client found");
  //   }

  //   // Encrypt numeric value to be passed into the Fhenix-powered contract.
  //   const encryptedValue = await fhenixClient.encrypt_uint8(value);

  //   const param: any = {
  //     ...encryptedValue,
  //     data: ethers.toQuantity(encryptedValue.data),
  //   };

  //   return param;
  // };

  // const {
  //   data: addResult,
  //   writeAsync: addValueScaffold,
  //   isLoading: isAddValueScaffoldLoading,
  // } = useScaffoldContractWrite({
  //   contractName: CONTRACT_NAME,
  //   functionName: "add",
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  const handleWrite = async () => {
    // if (addValueScaffold == null) {
    //   return;
    // }

    const value = Number(newValue);
    if (value === 0) {
      notification.warning("The value should not be 0");
      return;
    }

    try {
      setIsAddValueLoading(true);
      await writeTxn(() => addValueEthers(value));
      // await writeTxn(() => addValueViem(value));
      // await writeTxn(async () => addValueScaffold({ args: [await prepareArg(value)] }));
    } catch (e: any) {
      console.error("⚡️ ~ file: CounterForm.tsx:handleWrite ~ error", e);
    } finally {
      setIsAddValueLoading(false);
    }
  };

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <div className="flex flex-col justify-center items-center">
        <BeakerIcon className="h-8 w-8 fill-secondary" />
        <p>Counter demo</p>
      </div>

      {isTotalCounterLoading && <div>Loading</div>}

      <div className="p-2">{Number(counterValue) || 0}</div>

      <div className="py-5 space-y-3 first:pt-0 last:pb-1">
        <div className="flex gap-3 flex-col">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">add to counter</span>
              <span className="block text-xs font-extralight leading-none">num</span>
            </div>
            <IntegerInput
              value={newValue}
              onChange={setNewValue}
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
                {isAddValueLoading && <span className="loading loading-spinner loading-xs" />}
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
