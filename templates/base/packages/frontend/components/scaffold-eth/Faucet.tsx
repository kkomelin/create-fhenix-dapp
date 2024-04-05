"use client";

import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Address as AddressType, createWalletClient, http } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { fhenixLocal } from "~~/config/fhenixNetworks";
import { useLocalFhenixFaucet } from "~~/hooks/fhenix/useLocalFhenixFaucet";

const localWalletClient = createWalletClient({
  chain: fhenixLocal,
  transport: http(),
});

/**
 * Faucet modal which lets you send ETH to any address.
 */
export const Faucet = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState<AddressType>();
  const { address } = useAccount();

  const { chain: ConnectedChain } = useNetwork();

  const faucetRequest = useLocalFhenixFaucet(localWalletClient);

  useEffect(() => {
    setInputAddress(address);
  }, [address]);

  const sendETH = async () => {
    if (!inputAddress) {
      return;
    }
    try {
      setLoading(true);
      await faucetRequest(inputAddress);
      setLoading(false);
      setInputAddress(undefined);
    } catch (error) {
      console.error("⚡️ ~ file: Faucet.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== fhenixLocal.id) {
    return null;
  }

  return (
    <div>
      <label htmlFor="faucet-modal" className="btn btn-primary btn-sm font-normal gap-1">
        <BanknotesIcon className="h-4 w-4" />
        <span>Faucet</span>
      </label>
      <input type="checkbox" id="faucet-modal" className="modal-toggle" />
      <label htmlFor="faucet-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-3">Local Faucet</h3>
          <label htmlFor="faucet-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col space-y-3">
              <AddressInput
                placeholder="Destination Address"
                value={inputAddress ?? ""}
                onChange={value => setInputAddress(value as AddressType)}
              />
              <button className="h-10 btn btn-primary btn-sm px-2 rounded-full" onClick={sendETH} disabled={loading}>
                {!loading ? (
                  <BanknotesIcon className="h-6 w-6" />
                ) : (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                <span>Send</span>
              </button>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};
