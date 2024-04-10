# Create Fhenix DApp

<h4 align="center">
  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a> |
  <a href="https://docs.scaffoldeth.io">Scaffold ETH Documentation</a> |
  <a href="https://scaffoldeth.io">Scaffold ETH Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Fhenix blockchain. 
It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using Scaffold ETH, Next.js, RainbowKit, Hardhat, Wagmi, Viem, Ethers.js, Fhenixjs, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum/Fhenix network.

![Frontpage](https://repository-images.githubusercontent.com/779264860/cda636d8-9cc6-4e7e-973d-fde96d1df9c4)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/engine/install/)

## Quickstart

To get started with Create Fhenix DApp, follow the steps below:

1. Install and run it:

```
pnpm create fhenix-dapp@latest
```

2. Run a local network:

```
pnpm chain:start
```

This command starts a local Fhenix node using Hardhat and Docker for testing and development. 
You can customize the network configuration in `packages/backend/hardhat.config.ts`.

3. Deploy a demo contract to the local network:

```
pnpm deploy:contracts
```

Note: The default deployer contract will be automatically funded to be able to deploy to the local node.

The contract can be modified here: `packages/backend/contracts`
The contract deployment script can be customized here: `packages/backend/deploy`

4. (optional) Run smart contract tests to make sure it's been deployed successfully:

```
pnpm test
```

5. Then start your Next.js app:

```
pnpm start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page of the Counter demo on the frontpage. 
You can tweak the app config in `packages/frontend/scaffold.config.ts`.

6. (optional) When you finish your work, stop the local Fhenix node to release resources:

```
pnpm chain:stop
```

## Development entry points

- Tweak the app config in `packages/frontend/scaffold.config.ts`.
- Edit the demo smart contract: `packages/backend/contracts/Counter.sol`
- Edit your frontend in `packages/frontend/app`
- Edit your deployment scripts: `packages/backend/deploy`

## Documentation

-  <a href="https://www.fhenix.io/">Fhenix Website</a>
-  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a>
-  <a href="https://docs.scaffoldeth.io">Scaffold ETH Documentation</a>

## Known issues

- [ ] Fix issue: Cannot writ to the counter demo contract through Ether.js: `Error: could not coalesce error (error={ "code": -32603, "message": "Internal JSON-RPC error." }, payload={ "id": 10, "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [ { "data": "0x859fc54200000000000000000000000`
- [ ] Fix issue: backend: `pnpm prepare$ install-self-peers -- --ignore-scripts│  ERR_PNPM_MISSING_PACKAGE_NAME  pnpm add requires the package name`
- [ ] Fix issue: package.json files of the scaffolded instance are minimized (which is wrong)

## Credits

Many thanks to [Scaffold ETH](https://scaffoldeth.io/) developers for providing a solid foundation for this project.
