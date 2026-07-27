import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageJsonPath = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json");

/** CLI package semver from package.json. */
export const cliVersion = JSON.parse(readFileSync(packageJsonPath, "utf8")).version as string;
