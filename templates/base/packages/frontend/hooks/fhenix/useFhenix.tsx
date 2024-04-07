import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useEffect, useRef } from "react";

const useFhenix = () => {
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();

  const initFhenixProvider = () => {
    if (fhenixProvider.current != null) {
      return fhenixProvider.current;
    }

    // Initialize the provider.
    // @todo: Find a way not to use ethers.BrowserProvider because we already have viem and wagmi here.
    fhenixProvider.current = new BrowserProvider(window.ethereum as Eip1193Provider);
    // fhenixProvider.current = new JsonRpcProvider(connectedChain?.rpcUrls.default.http[0]);
  };

  const initFhenixClient = () => {
    if (fhenixClient.current != null) {
      return fhenixClient.current;
    }

    initFhenixProvider();

    fhenixClient.current = new FhenixClient({ provider: fhenixProvider.current });
  };

  useEffect(() => {
    initFhenixProvider();
    initFhenixClient();
  }, []);

  return {
    fhenixClient: fhenixClient.current,
    fhenixProvider: fhenixProvider.current,
  };
};

export default useFhenix;
