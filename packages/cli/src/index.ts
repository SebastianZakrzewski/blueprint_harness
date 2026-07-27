/** Package identity for the Harness CLI package. */
export const packageIdentity = {
  name: "@blueprint-harness/cli",
  version: "0.0.0",
} as const;

export { CHECK_PROVIDER_NAMES, runCheck } from "./commands/check.js";
export { buildInspectResult, runInspect } from "./commands/inspect.js";
export { runInit } from "./commands/init.js";
export { runValidateDocs } from "./commands/validate-docs.js";
export { createHarnessProgram, runHarness } from "./main.js";
export { formatValidationResult, emitValidationResult } from "./output.js";
export { cliVersion } from "./version.js";
