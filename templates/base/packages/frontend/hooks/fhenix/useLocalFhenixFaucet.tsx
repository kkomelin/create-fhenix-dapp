import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";
import { FHENIX_LOCAL_FAUCET_URL } from "~~/config/fhenix";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type TransactionFunc = (tx: { to: string }) => Promise<string | undefined>;

/**
 * Custom notification content for Operation.
 */
const OpNotification = ({ message }: { message: string }) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
    </div>
  );
};

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useLocalFhenixFaucet = (_walletClient?: WalletClient): TransactionFunc => {
  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }

  const result: TransactionFunc = async ({ to }) => {
    if (walletClient == null) {
      notification.error("Cannot access faucet");
      console.error("⚡️ ~ file: useLocalFhenixFaucet.tsx ~ error");
      return;
    }

    let notificationId = null;
    notificationId = notification.loading(<OpNotification message="Waiting for funds to arrive" />);

    let faucetResult = "";

    try {
      // @fixme: For some reason, probably because of Next.js intervention to the Fetch API, the result of the request is of a wrong format. Fix it.

      const fetchResult = await fetch(
        FHENIX_LOCAL_FAUCET_URL +
          "?" +
          new URLSearchParams({
            address: to,
          }),
        {
          method: "GET",
          headers: new Headers({ "content-type": "application/json" }),
          mode: "no-cors",
        },
      );

      const json = await fetchResult.json();

      if (json.error != null) {
        notification.error(json.error);
        throw new Error(json.error);
      }

      notification.remove(notificationId);

      notification.success(<OpNotification message="Funds arrived successfully" />, {
        icon: "🎉",
      });
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useLocalFhenixFaucet.tsx ~ error", error);
      const message = getParsedError(error);
      notification.error(message);
      throw error;
    }
    return faucetResult;
  };

  return result;
};
