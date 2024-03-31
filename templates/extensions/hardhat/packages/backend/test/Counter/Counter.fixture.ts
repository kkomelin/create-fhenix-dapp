import hre from "hardhat";
import type { Counter } from "../../types";

export async function deployCounterFixture(): Promise<{
  counter: Counter;
  address: string;
}> {
  const [owner] = await hre.ethers.getSigners();
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.connect(owner).deploy();
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  return { counter, address };
}

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if ((await hre.ethers.provider.getBalance(signers[0].address)).toString() === "0") {
      await hre.fhenixjs.getFunds(signers[0].address);
      console.log("Received tokens from the local faucet. Ready to deploy.");
    }
  }
}
