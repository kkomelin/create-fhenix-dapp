import { EncryptionTypes, FhenixClient } from "fhenixjs";
import { ChangeEvent, useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "Counter";

const CounterForm = () => {
  const [newValue, setNewValue] = useState<number>();

  const { counter, isLoading: isTotalCounterLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "getCounter",
    watch: true,
  });

  // @todo: Unseal value before displaying it.
  // const cleartext = client.unseal(contractAddress, sealed);

  const handleAddValue = async () => {
    // @todo: Call Counter:add method
    // encode the new value with fhenixjs
    // @todo: Use wagmi provider.

    // initialize your web3 provider
    const provider = new JsonRpcProvider("https://test01.fhenix.zone/evm");

    // initialize Fhenix Client
    const client = new FhenixClient({ provider });

    // to encrypt data for a Fhenix contract
    let encrypted = await client.encrypt(5, EncryptionTypes.uint8);

    // New way...
    // useScaffoldContractWrite({ contractName: CONTRACT_NAME, functionName: "add", args: [encrypted] });
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
          <button className="px-3 py-2 border rounded-sm" onClick={() => handleAddValue()}>
            Add value
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterForm;
