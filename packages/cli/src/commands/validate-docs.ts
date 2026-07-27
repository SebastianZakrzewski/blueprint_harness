import {
  buildValidationResult,
  resolveRepoRoot,
  validateDocs,
  type Finding,
  type ValidationResult,
} from "@blueprint-harness/core";

import { emitValidationResult, type OutputFormat } from "../output.js";

export interface ValidateDocsCommandOptions {
  rootPath?: string;
  format?: OutputFormat;
}

/**
 * Thin wrapper over Core validateDocs — no validation logic in CLI.
 *
 * @param options - Optional repo root and output format.
 * @returns Process exit code (0 success, 1 failure).
 */
export function runValidateDocs(options: ValidateDocsCommandOptions = {}): number {
  const startPath = options.rootPath ?? process.cwd();
  const rootPath = resolveRepoRoot(startPath);
  const format = options.format ?? "human";
  const result = validateDocs(rootPath);

  return emitValidationResult(result, format, "validate-docs");
}
