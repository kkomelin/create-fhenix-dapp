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
    ? `2. Run a local network:

\`\`\`
pnpm chain
\`\`\`

This command starts a local Fhenix node using ${solidityFramework[0]} and Docker for testing and development. 
You can customize the network configuration in ${networkConfigPath[0]}.

3. Deploy a demo contract to the local network:

\`\`\`
pnpm deploy:contracts
\`\`\`

Note: The default deployer contract will be automatically funded to be able to deploy to the local node.

The contract can be modified here: ${contractsPath[0]}
The contract deployment script can be customized here: ${scriptsPath[0]}

4. (optional) Run smart contract tests to make sure it's been deployed successfully:

\`\`\`
pnpm test
\`\`\`

5. Then start your Next.js app:`
    : "2. Start your Next.js app:"
}

\`\`\`
pnpm start
\`\`\`

Visit your app on: \`http://localhost:3000\`. You can interact with your smart contract using the \`Debug Contracts\` page of the Counter demo on the frontpage. 
You can tweak the app config in ${frontendScaffoldConfigPath[0]}.
${
  Boolean(solidityFramework[0])
    ? `

## Development entry points

- Tweak the app config in ${frontendScaffoldConfigPath[0]}.
- Edit your smart contract \`Counter.sol\` in ${contractsPath[0]}.
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
  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a> |
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Fhenix blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using Next.js, RainbowKit, ${
    Boolean(solidityFramework[0]) ? solidityFramework[0] + ", " : ""
  }Wagmi, Viem,  Ethers.js, Fhenixjs and Typescript.
${
  Boolean(solidityFramework[0])
    ? "\n- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it."
    : ""
}
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.
- **Fhenix tools**: fhenix-hardhat-docker, fhenix-hardhat-plugin and fhenixjs for a quick start with Fhenix.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/engine/install/)

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

-  <a href="https://www.fhenix.io/">Fhenix Website</a>
-  <a href="https://docs.fhenix.zone/docs/devdocs/intro">Fhenix Documentation</a>
-  <a href="https://docs.scaffoldeth.io">Scaffold ETH Documentation</a>

## Credits

Many thanks to [Scaffold ETH](https://scaffoldeth.io/) developers for providing a solid foundation for this project.`;

export default withDefaults(contents, {
  solidityFramework: "",
  networkConfigPath: "",
  contractsPath: "",
  frontendScaffoldConfigPath: "",
  frontendAppPagePath: "",
  scriptsPath: "",
  testCommand: "",
});
