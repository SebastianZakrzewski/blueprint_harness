import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const ROOT = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@blueprint-harness/core": join(ROOT, "packages/core/dist/index.js"),
      "@blueprint-harness/cli": join(ROOT, "packages/cli/dist/index.js"),
      "@blueprint-harness/profiles-typescript-node": join(
        ROOT,
        "packages/profiles/typescript-node/dist/index.js",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
