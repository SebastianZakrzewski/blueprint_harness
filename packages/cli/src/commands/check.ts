import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  buildValidationResult,
  resolveRepoRoot,
  validateDocs,
  type Finding,
  type ValidationResult,
} from "@blueprint-harness/core";

import { runArchLints, runStructuralHarnessChecks, runStructuralImportGraph } from "@blueprint-harness/profiles-typescript-node";

import { emitValidationResult, type OutputFormat } from "../output.js";

type CheckMode = "fast" | "full";

type CheckProvider = (rootPath: string) => ValidationResult;

function workspaceIntegrityCheck(rootPath: string): ValidationResult {
  const findings: Finding[] = [];

  if (!existsSync(join(rootPath, "pnpm-workspace.yaml"))) {
    findings.push({
      id: "HARNESS-001",
      severity: "error",
      path: "pnpm-workspace.yaml",
      message: "pnpm-workspace.yaml is missing at repository root.",
    });
  }

  return buildValidationResult(findings);
}

function injectedFailureCheck(): ValidationResult {
  const injectId = process.env.HARNESS_CHECK_INJECT;
  if (!injectId) {
    return buildValidationResult([]);
  }

  return buildValidationResult([
    {
      id: injectId,
      severity: "error",
      message: `Injected check failure for fixture testing (${injectId}).`,
    },
  ]);
}

const FAST_PROVIDERS: CheckProvider[] = [
  (rootPath) => validateDocs(rootPath),
  (rootPath) => runStructuralHarnessChecks(rootPath),
  () => injectedFailureCheck(),
];

const FULL_PROVIDERS: CheckProvider[] = [
  (rootPath) => validateDocs(rootPath),
  (rootPath) => workspaceIntegrityCheck(rootPath),
  (rootPath) => runArchLints(rootPath),
  (rootPath) => runStructuralHarnessChecks(rootPath),
  (rootPath) => runStructuralImportGraph(rootPath),
  () => injectedFailureCheck(),
];

function mergeCheckResults(results: ValidationResult[]): ValidationResult {
  const findings = results.flatMap((result) => result.findings);
  return buildValidationResult(findings);
}

export interface CheckCommandOptions {
  mode: CheckMode;
  rootPath?: string;
  format?: OutputFormat;
}

/**
 * Runs registered check providers for fast or full mode.
 *
 * @param options - Check mode, optional root, and output format.
 * @returns Process exit code.
 */
export function runCheck(options: CheckCommandOptions): number {
  const startPath = options.rootPath ?? process.cwd();
  const rootPath = resolveRepoRoot(startPath);
  const format = options.format ?? "human";
  const providers = options.mode === "full" ? FULL_PROVIDERS : FAST_PROVIDERS;
  const result = mergeCheckResults(providers.map((provider) => provider(rootPath)));

  return emitValidationResult(result, format, `check --${options.mode}`);
}

/** Provider lists exposed for tests proving --full is a superset of --fast. */
export const CHECK_PROVIDER_NAMES = {
  fast: ["validate-docs", "structural-harness", "injected-failure"],
  full: [
    "validate-docs",
    "workspace-integrity",
    "arch-lints",
    "structural-harness",
    "structural-import-graph",
    "injected-failure",
  ],
} as const;
