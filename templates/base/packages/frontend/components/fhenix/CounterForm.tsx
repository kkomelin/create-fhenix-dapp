import { JsonRpcProvider } from "ethers";
import { EncryptionTypes, FhenixClient } from "fhenixjs";
import { ChangeEvent, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<number>(0);
  const [counterValue, setCounterValue] = useState<number>();
  const { chain: connectedChain } = useNetwork();
  const { data: deployedContractData, isLoading: isDeployedContractLoading } = useDeployedContractInfo(CONTRACT_NAME);

  const { data: sealedCounter, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  const getFhenixClient = () => {
    // Initialize the provider.
    // @todo: Find a way not to use ethers.JsonRpcProvider because we already have viem and wagmi here.
    const provider = new JsonRpcProvider(connectedChain?.rpcUrls.default + "/evm"); // "https://test01.fhenix.zone/evm"

    // Initialize Fhenix Client.
    return new FhenixClient({ provider });
  };

  const encryptNumber = async (value: number) => {
    const client = getFhenixClient();
    // Encrypt data for a Fhenix contract.
    return await client.encrypt(value, EncryptionTypes.uint8);
  };

  const unsealValue = (contractAddress: string, value: number) => {
    const client = getFhenixClient();
    // Unseal value before displaying it.
    return client.unseal(contractAddress, sealedCounter);
  };

  const handleAddValue = async () => {
    // @todo: Call Counter:add method

    const encryptedNumber = encryptNumber(newValue);

    // New way...
    // useScaffoldContractWrite({ contractName: CONTRACT_NAME, functionName: "add", args: [encryptedNumber] });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewValue(Number(e.target.value));
  };

  useEffect(() => {
    if (!isDeployedContractLoading || deployedContractData?.address == null) {
      return;
    }

    // Unseal value before displaying it.
    const clearedValue = unsealValue(deployedContractData?.address, sealedCounter);
    // @todo: Use bigint for large values.
    setCounterValue(Number(clearedValue));
  }, [sealedCounter, isDeployedContractLoading]);

  return (
    <div className="flex flex-col items-center justify-center border-indigo-500 border p-8">
      <h2 className="font-semibold mb-5">Simple demo</h2>

      {isTotalCounterLoading && <div>Loading</div>}

      <div className="flex flex-col justify-center items-center">
        <div className="p-2">Counter value: {counterValue}</div>

        <div className="flex flex-row">
          <input className="px-3 py-2 rounded-sm" onChange={handleInputChange} />
          <button className="px-3 py-2 border rounded-sm" onClick={handleAddValue}>
            Add value
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterForm;
