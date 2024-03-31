const path = require("path");

const buildNextEslintCommand = (filenames) =>
  `pnpm next:lint --fix --file ${filenames
    .map((f) => path.relative(path.join("packages", "nextjs"), f))
    .join(" --file ")}`;

const checkTypesNextCommand = () => "pnpm next:check-types";

const buildHardhatEslintCommand = (filenames) =>
  `pnpm hardhat:lint-staged --fix ${filenames
    .map((f) => path.relative(path.join("packages", "hardhat"), f))
    .join(" ")}`;

module.exports = {
  "packages/frontend/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    checkTypesNextCommand,
  ],
  "packages/backend/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};
