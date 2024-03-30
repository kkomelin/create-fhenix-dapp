import { withDefaults } from "../utils.js";

const getQuickStart = ({
  solidityFramework,
  networkConfigPath,
  contractsPath,
  frontendScaffoldConfigPath,
  frontendAppPagePath,
  scriptsPath,
  testCommand,
}) => `## Quickstart

To get started with Create Fhenix DApp, follow the steps below:

1. Install dependencies if it was skipped in CLI:

\`\`\`
cd my-fhenix-dapp-example
pnpm install
\`\`\`

${
  Boolean(solidityFramework[0])
    ? `2. Run a local network in the first terminal:

\`\`\`
pnpm chain
\`\`\`

This command starts a local Ethereum network using ${solidityFramework[0]}. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in ${networkConfigPath[0]}.

3. On a second terminal, deploy the test contract:

\`\`\`
pnpm deploy:contracts
\`\`\`

This command deploys a test smart contract to the local network. The contract is located in ${contractsPath[0]} and can be modified to suit your needs. The \`yarn deploy\` command uses the deploy script located in ${scriptsPath[0]} to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:`
    : "2. Start your NextJS app:"
}

\`\`\`
pnpm start
\`\`\`

Visit your app on: \`http://localhost:3000\`. You can interact with your smart contract using the \`Debug Contracts\` page. 
You can tweak the app config in ${frontendScaffoldConfigPath[0]}.
${
  Boolean(solidityFramework[0])
    ? `
Run smart contract test with ${testCommand[0]}

- Edit your smart contract \`YourContract.sol\` in ${contractsPath[0]}
- Edit your frontend homepage at ${frontendAppPagePath[0]}. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in ${scriptsPath[0]}
`
    : ""
}`;

const contents = ({
  solidityFramework,
  networkConfigPath,
  contractsPath,
  frontendScaffoldConfigPath,
  frontendAppPagePath,
  scriptsPath,
  testCommand,
}) =>
  `# 🏗 Create Fhenix DApp

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, ${
    Boolean(solidityFramework[0]) ? solidityFramework[0] + ", " : ""
  }Wagmi, Viem, and Typescript.
${
  Boolean(solidityFramework[0])
    ? "\n- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it."
    : ""
}
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

${getQuickStart({
  solidityFramework,
  networkConfigPath,
  contractsPath,
  frontendScaffoldConfigPath,
  frontendAppPagePath,
  scriptsPath,
  testCommand,
})}
## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Create Fhenix DApp.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Create Fhenix DApp

We welcome contributions to Create Fhenix DApp!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Create Fhenix DApp.`;

export default withDefaults(contents, {
  solidityFramework: "",
  networkConfigPath: "",
  contractsPath: "",
  frontendScaffoldConfigPath: "",
  frontendAppPagePath: "",
  scriptsPath: "",
  testCommand: "",
});
