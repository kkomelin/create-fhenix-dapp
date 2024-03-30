import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "fhenix-hardhat-docker";
import "fhenix-hardhat-plugin";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";
import "./tasks";

dotenvConfig();

const TESTNET_CHAIN_ID = 42069;
const TESTNET_RPC_URL = "https://api.testnet.fhenix.zone:7747";

// @todo: Set proper type for the network config.
const testnetConfig: any = {
  chainId: TESTNET_CHAIN_ID,
  url: TESTNET_RPC_URL,
};

// Select either private keys or mnemonic from .env file or environment variables
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!deployerPrivateKey) {
  let mnemonic = process.env.DEPLOYER_MNEMONIC;
  if (!mnemonic) {
    throw new Error("No mnemonic or private key provided, please set MNEMONIC or KEY in your .env file");
  }
  testnetConfig.accounts = {
    count: 10,
    mnemonic,
    path: "m/44'/60'/0'/0",
  };
} else {
  testnetConfig.accounts = [deployerPrivateKey];
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
    //     runs: 200,
    //   },
    // },
  },
  // Optional: defaultNetwork is already being set to "localfhenix" by fhenix-hardhat-plugin
  defaultNetwork: "localfhenix",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    testnet: testnetConfig,
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
