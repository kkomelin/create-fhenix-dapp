"use client";

import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createWalletClient, http } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { fhenixLocal } from "~~/config/fhenixNetworks";
import { useLocalFhenixFaucet } from "~~/hooks/fhenix/useLocalFhenixFaucet";
import { useAccountBalance } from "~~/hooks/scaffold-eth";

const localWalletClient = createWalletClient({
  chain: fhenixLocal,
  transport: http(),
});

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();
  const { balance } = useAccountBalance(address);

  const { chain: ConnectedChain } = useNetwork();

  const [loading, setLoading] = useState(false);
  const faucetRequest = useLocalFhenixFaucet(localWalletClient);

  const sendETH = async () => {
    if (!address) {
      return;
    }

    try {
      setLoading(true);
      await faucetRequest(address);
      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== fhenixLocal.id) {
    return null;
  }

  return (
    <div
      className={
        balance
          ? "ml-1"
          : "ml-1 tooltip tooltip-bottom tooltip-secondary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:right-0"
      }
      data-tip="Grab funds from faucet"
    >
      <button className="btn btn-secondary btn-sm px-2 rounded-full" onClick={sendETH} disabled={loading}>
        {!loading ? (
          <BanknotesIcon className="h-4 w-4" />
        ) : (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </button>
    </div>
  );
};
