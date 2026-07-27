/** Package identity for the Harness CLI package. */
export const packageIdentity = {
  name: "@blueprint-harness/cli",
  version: "0.0.0",
} as const;

export { runAutonomyStatus } from "./commands/autonomy.js";
export { CHECK_PROVIDER_NAMES, runCheck } from "./commands/check.js";
export { buildInspectResult, runInspect } from "./commands/inspect.js";
export { runEnv } from "./commands/env.js";
export { runValidateDocs } from "./commands/validate-docs.js";
export { createHarnessProgram, runHarness } from "./main.js";
export { formatValidationResult, emitValidationResult } from "./output.js";
export { cliVersion } from "./version.js";
