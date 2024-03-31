import { withDefaults } from "../utils.js";

const contents = ({ packageVercelIgnoreContent }) =>
  `# --- Monorepo files ---

.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.eslintcache
.DS_Store
.vscode
.idea
.vercel

# --- Next.js files ---

# dependencies
packages/frontend/node_modules
packages/frontend/.pnp
packages/frontend/.pnp.js

# testing
packages/frontend/coverage

# next.js
packages/frontend/.next/
packages/frontend/out/

# production
packages/frontend/build

# misc
packages/frontend/.DS_Store
packages/frontend/*.pem

# debug
packages/frontend/npm-debug.log*
packages/frontend/yarn-debug.log*
packages/frontend/yarn-error.log*
packages/frontend/.pnpm-debug.log*

# local env files
packages/frontend/.env.local
packages/frontend/.env.development.local
packages/frontend/.env.test.local
packages/frontend/.env.production.local

# typescript
packages/frontend/*.tsbuildinfo

${packageVercelIgnoreContent.join("\n")}`;

export default withDefaults(contents, {
  packageVercelIgnoreContent: "",
});
