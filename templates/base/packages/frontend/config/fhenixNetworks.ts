import { defineChain } from "viem";

export const fhenixFrontier = defineChain({
  id: 42069,
  name: "Fhenix Frontier",
  network: "fhenixFrontier",
  nativeCurrency: { name: "tFHE", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    public: {
      http: ["https://api.testnet.fhenix.zone:7747"],
    },
    default: {
      http: ["https://api.testnet.fhenix.zone:7747"],
    },
  },
  blockExplorers: {
    default: { name: "Fhenix Explorer", url: "https://explorer.testnet.fhenix.zone" },
  },
});

export const fhenixLocal = defineChain({
  id: 412346,
  name: "Fhenix Local",
  network: "fhenixLocal",
  nativeCurrency: { name: "tFHE", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    public: {
      http: ["http://127.0.0.1:42069"],
    },
    default: {
      http: ["http://127.0.0.1:42069"],
    },
  },
  blockExplorers: {
    default: { name: "Fhenix Local Explorer", url: "http://localhost:3000/blockexplorer" },
  },
});
