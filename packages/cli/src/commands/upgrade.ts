import { runUpgrade } from "@blueprint-harness/core";

import { emitValidationResult, type OutputFormat } from "../output.js";

export interface UpgradeCommandOptions {
  rootPath?: string;
  targetVersion: string;
  dryRun?: boolean;
  format?: OutputFormat;
}

/**
 * Runs harness upgrade against a target blueprint version.
 *
 * @param options - Project root, target version, and dry-run flag.
 * @returns Process exit code.
 */
export function runUpgradeCommand(options: UpgradeCommandOptions): number {
  const rootPath = options.rootPath ?? process.cwd();
  const format = options.format ?? "human";
  const report = runUpgrade({
    projectRoot: rootPath,
    targetBlueprintVersion: options.targetVersion,
    dryRun: options.dryRun ?? false,
  });

  const result = {
    ok: report.ok,
    findings: report.findings.map((finding) => ({
      id: finding.id,
      severity: finding.severity as "error" | "warning" | "info",
      message: finding.message,
    })),
  };

  return emitValidationResult(result, format, "upgrade");
}
