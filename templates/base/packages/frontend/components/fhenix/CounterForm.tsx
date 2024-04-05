import { JsonRpcProvider } from "ethers";
import { EncryptionTypes, FhenixClient } from "fhenixjs";
import { ChangeEvent, useState } from "react";
import { useNetwork } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<number>(0);
  const { chain: connectedChain } = useNetwork();

  const { data: counter, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  const encryptNumber = async (value: number) => {
    // Initialize the provider.
    // @todo: Find a way not to use ethers.JsonRpcProvider because we already have viem and wagmi here.
    const provider = new JsonRpcProvider(connectedChain?.rpcUrls.default + "/evm"); // "https://test01.fhenix.zone/evm"

    // Initialize Fhenix Client.
    const client = new FhenixClient({ provider });

    // Encrypt data for a Fhenix contract.
    return await client.encrypt(value, EncryptionTypes.uint8);
  };

  // @todo: Unseal value before displaying it.
  // const cleartext = client.unseal(contractAddress, sealed);

  const handleAddValue = async () => {
    // @todo: Call Counter:add method

    const encryptedNumber = encryptNumber(newValue);

    // New way...
    // useScaffoldContractWrite({ contractName: CONTRACT_NAME, functionName: "add", args: [encryptedNumber] });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewValue(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center border-indigo-500 border p-8">
      <h2 className="font-semibold mb-5">Simple demo</h2>

      {isTotalCounterLoading && <div>Loading</div>}

      <div className="flex flex-col justify-center items-center">
        <div className="p-2">Counter value: {counter || 0}</div>

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
