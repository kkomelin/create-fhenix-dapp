import { execa } from "execa";
import { Options } from "../types";

// Checkout the latest release tag in a git submodule
async function checkoutLatestTag(submodulePath: string): Promise<void> {
  try {
    const { stdout } = await execa("git", ["tag", "-l", "--sort=-v:refname"], {
      cwd: submodulePath,
    });
    const tagLines = stdout.split("\n");
    if (tagLines.length > 0) {
      const latestTag = tagLines[0];
      await execa("git", ["-C", `${submodulePath}`, "checkout", latestTag]);
    } else {
      throw new Error(`No tags found in submodule at ${submodulePath}`);
    }
  } catch (error) {
    console.error("Error checking out latest tag:", error);
    throw error;
  }
}

export async function createFirstGitCommit(
  targetDir: string,
  options: Options
) {
  try {
    // TODO: Move the logic for adding submodules to templates
    await execa("git", ["add", "-A"], { cwd: targetDir });
    await execa(
      "git",
      ["commit", "-m", "Initial commit with Create Fhenix DApp", "--no-verify"],
      { cwd: targetDir }
    );
  } catch (e: any) {
    // cast error as ExecaError to get stderr

    throw new Error("Failed to initialize git repository", {
      cause: e?.stderr ?? e,
    });
  }
}
