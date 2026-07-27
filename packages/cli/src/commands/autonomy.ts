import { buildAutonomyStatusReport } from "@blueprint-harness/core";

import { emitValidationResult, type OutputFormat } from "../output.js";

export interface AutonomyCommandOptions {
  format?: OutputFormat;
}

/**
 * Prints autonomy status report (A0 defaults, freeze, OD-008 staging allowance).
 *
 * @param options - Output format options.
 * @returns Process exit code.
 */
export function runAutonomyStatus(options: AutonomyCommandOptions = {}): number {
  const format = options.format ?? "human";
  const report = buildAutonomyStatusReport();

  if (format === "json") {
    console.log(JSON.stringify(report, null, 2));
    return 0;
  }

  console.log(`autonomy status: level=${report.currentLevel} frozen=${report.frozen}`);
  console.log(`staging gate allowed: ${report.stagingGateAllowed}`);
  console.log(`production gate allowed: ${report.productionGateAllowed}`);
  return 0;
}
