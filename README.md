# Create Fhenix DApp

<h4 align="center">
  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a> |
  <a href="https://docs.scaffoldeth.io">Scaffold ETH Documentation</a> |
  <a href="https://scaffoldeth.io">Scaffold ETH Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Fhenix blockchain. 
It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, Fhenixjs, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Create Fhenix DApp, follow the steps below:

1. Install from NPM Registry and follow the CLI instructions.

```
npx create-fhenix-dapp@latest
# or
pnpm create fhenix-dapp
```

2. Run a local network in the first terminal:

```
pnpm chain:start
```

This command starts a local Ethereum network using Hardhat or Foundry, depending on which one you selected in the CLI. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in:

- `packages/backend/hardhat.config.ts` if you have Hardhat as solidity framework.

This command fund the default deployer contract to be able to deploy to the local node.

3. On a second terminal, deploy the test contract:

```
pnpm deploy:contracts
```

This command deploys a test smart contract to the local network. The contract can be modified to suit your needs. Is located in:

- Hardhat => `packages/backend/contracts`

The `pnpm deploy:contracts` command uses a deploy script to deploy the contract to the network. You can customize it. Is located in:

- Hardhat => `packages/backend/deploy`

4. On a third terminal, start your NextJS app:

```
pnpm start
```

5. (optional) When you finish your work, stop the local Fhenix node:

```
pnpm chain:stop
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. 
You can tweak the app config in `packages/frontend/scaffold.config.ts`.

Run smart contract test with `pnpm hardhat:test`.

- Edit your smart contract:
  - Hardhat => `YourContract.sol` in `packages/banckend/contracts`
- Edit your frontend in `packages/frontend/pages`
- Edit your deployment scripts:
  - Hardhat => `packages/backend/deploy`

## Documentation

-  <a href="https://www.fhenix.io/">Fhenix Website</a>
-  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a>
-  <a href="https://docs.scaffoldeth.io">Scaffold ETH Documentation</a>

## Roadmap

- [ ] Finish the Fhenix Counter demo
- [ ] Fix issue: backend: pnpm prepare$ install-self-peers -- --ignore-scripts│  ERR_PNPM_MISSING_PACKAGE_NAME  pnpm add requires the package name
- [ ] Fix issue: package.json files of the scaffolded instance are minimized (which is wrong)

## Contributing to Create Fhenix DApp

TBD
