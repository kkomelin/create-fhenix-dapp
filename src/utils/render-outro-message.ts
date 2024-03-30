import chalk from "chalk";
import type { Options } from "../types";

export async function renderOutroMessage(options: Options) {
  let message = `
  \n
  ${chalk.bold.green("Congratulations!")} Your project has been scaffolded! 🎉

  ${chalk.bold("Next steps:")}
  
  ${chalk.dim("cd")} ${options.project}
  `;

  if (options.extensions.includes("hardhat")) {
    message += `
    \t${chalk.bold("Start the local development node")}
    \t${chalk.dim("pnpm")} chain
    `;

    message += `
    \t${chalk.bold("In a new terminal window, deploy your contracts")}
    \t${chalk.dim("pnpm")} deploy
   `;
  }

  message += `
  \t${chalk.bold("In a new terminal window, start the frontend")}
  \t${chalk.dim("pnpm")} start
  `;

  message += `
  ${chalk.bold.green("Thanks for using Create Fhenix DApp 🙏, Happy Building!")}
  `;

  console.log(message);
}
