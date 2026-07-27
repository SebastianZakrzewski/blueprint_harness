import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validateDocsStructure } from "./docs-validator.js";
import { lintExecPlans } from "./execplan-linter.js";
import {
  buildValidationResult,
  hasBlockingFindings,
  serializeValidationResult,
  type Finding,
  type ValidationResult,
} from "./validation-result.js";

export interface ValidateDocsOptions {
  format?: "human" | "json";
}

/**
 * Walks up from startPath until pnpm-workspace.yaml is found.
 *
 * @param startPath - Directory to begin searching from.
 * @returns Monorepo root path, or startPath when not found.
 */
export function resolveRepoRoot(startPath: string): string {
  let current = resolve(startPath);

  while (true) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return resolve(startPath);
    }
    current = parent;
  }
}

/**
 * Validates documentation structure and ExecPlans under a repository root.
 *
 * @param rootPath - Repository root containing docs/.
 * @param _options - Output format options (used by CLI entry).
 * @returns Validation result with PLAN-005 Model A semantics.
 */
export function validateDocs(
  rootPath: string,
  _options?: ValidateDocsOptions,
): ValidationResult {
  const resolvedRoot = resolve(rootPath);
  const findings: Finding[] = [
    ...validateDocsStructure(resolvedRoot),
    ...lintExecPlans(resolvedRoot),
  ];

  return buildValidationResult(findings);
}

function formatHuman(result: ValidationResult): string {
  if (result.findings.length === 0) {
    return "validate-docs: OK (no findings)";
  }

  return result.findings
    .map((finding) => {
      const location = finding.path ? `${finding.path}: ` : "";
      return `${finding.severity.toUpperCase()} [${finding.id}] ${location}${finding.message}`;
    })
    .join("\n");
}

function parseCliArgs(argv: string[]): { rootPath?: string; format: "human" | "json" } {
  let format: "human" | "json" = "human";
  let rootPath: string | undefined;

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === "--format") {
      const next = argv[index + 1];
      if (next === "json") {
        format = "json";
        index++;
      }
    } else if (arg === "--format=json") {
      format = "json";
    } else if (arg && !arg.startsWith("-")) {
      rootPath = arg;
    }
  }

  return { rootPath, format };
}

function runCli(argv: string[]): void {
  const { rootPath: argRoot, format } = parseCliArgs(argv);
  const rootPath = argRoot ? resolve(argRoot) : resolveRepoRoot(process.cwd());
  const result = validateDocs(rootPath);

  if (format === "json") {
    console.log(serializeValidationResult(result));
  } else {
    console.log(formatHuman(result));
  }

  if (hasBlockingFindings(result)) {
    process.exit(1);
  }
}

const entryPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === entryPath) {
  runCli(process.argv.slice(2));
}
