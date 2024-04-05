import { BeakerIcon } from "@heroicons/react/24/outline";
import { JsonRpcProvider } from "ethers";
import { EncryptionTypes, FhenixClient } from "fhenixjs";
import { useEffect, useState } from "react";
import { TransactionReceipt } from "viem";
import { useNetwork, useWaitForTransaction } from "wagmi";
import { TxReceipt } from "~~/app/debug/_components/contract";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useTransactor,
} from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { IntegerInput } from "../scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<string | bigint>(0n);
  const [counterValue, setCounterValue] = useState<number>();
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

  const {
    data: addResult,
    writeAsync: addValue,
    isLoading: isAddValueLoading,
  } = useScaffoldContractWrite({
    contractName: CONTRACT_NAME,
    functionName: "add",
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleWrite = async () => {
    if (addValue) {
      try {
        const encryptedNumber = await encryptNumber(Number(newValue));

        const makeWriteWithParams = () => addValue({ args: [encryptedNumber] });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: addResult?.hash,
  });

  const getFhenixClient = () => {
    // Initialize the provider.
    // @todo: Find a way not to use ethers.JsonRpcProvider because we already have viem and wagmi here.
    const provider = new JsonRpcProvider(connectedChain?.rpcUrls.default.http[0]); // "https://test01.fhenix.zone/evm"

    // Initialize Fhenix Client.
    return new FhenixClient({ provider });
  };

  const encryptNumber = async (value: number) => {
    const client = getFhenixClient();
    // Encrypt data for a Fhenix contract.
    return await client.encrypt(value, EncryptionTypes.uint8);
  };

  const unsealValue = (contractAddress: string, sealedValue: string) => {
    const client = getFhenixClient();
    // Unseal value before displaying it.
    return client.unseal(contractAddress, sealedValue);
  };

  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  useEffect(() => {
    if (isDeployedContractLoading || deployedContractData?.address == null) {
      return;
    }
    console.log("sealed counter value", sealedCounterValue);

    // Unseal value before displaying it.
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

      {(isTotalCounterLoading || isAddValueLoading) && <div>Loading</div>}

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
                setDisplayedTxResult(undefined);
                setNewValue(updatedTxValue);
              }}
              placeholder="number"
              disableMultiplyBy1e18={true}
            />
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex-grow basis-0">
              {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
            </div>

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
        {txResult ? (
          <div className="flex-grow basis-0">
            <TxReceipt txResult={txResult} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CounterForm;
