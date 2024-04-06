import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";
import { FHENIX_LOCAL_FAUCET_URL } from "~~/config/fhenix";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type RequestFunc = (to: string) => Promise<string | undefined>;

/**
 * Custom notification content for the request.
 */
const RequestNotification = ({ message }: { message: string }) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
    </div>
  );
};

/**
 * Runs Request passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useLocalFhenixFaucet = (_walletClient?: WalletClient): RequestFunc => {
  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }

  const result: RequestFunc = async (to: string) => {
    if (walletClient == null) {
      notification.error("Cannot access faucet");
      console.error("⚡️ ~ file: useLocalFhenixFaucet.tsx ~ error");
      return;
    }

    let notificationId = notification.loading(<RequestNotification message="Requesting funds from the faucet" />);

    let faucetResult = "";

    try {
      const fetchResult = await fetch(
        FHENIX_LOCAL_FAUCET_URL +
          "?" +
          new URLSearchParams({
            address: to,
          }),
        {
          method: "GET",
          headers: new Headers({ "Content-Type": "application/json" }),
          mode: "no-cors",
        },
      );

      // @fixme Find the reason of why the server responds with wrong request and once it's fixed, process the response properly.
      // const json = await fetchResult.json();
      // if (json.error != null) {
      //   throw new Error(json);
      // }

      notification.remove(notificationId);

      notification.success(
        <RequestNotification message="Funds arrived successfully. Wait for a few more seconds for the interface to update." />,
        {
          icon: "🎉",
        },
      );
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
