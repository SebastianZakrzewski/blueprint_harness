import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { buildValidationResult, type Finding } from "@blueprint-harness/core";

function collectFiles(dir: string, out: string[]): void {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (entry.isFile() && /\.(ts|tsx|yml|yaml)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

/**
 * Runs typescript-node architecture and harness protection lints.
 *
 * @param projectRoot - Project root to scan.
 * @returns Validation result with invariant-tagged findings.
 */
export function runArchLints(projectRoot: string): ReturnType<typeof buildValidationResult> {
  const findings: Finding[] = [];
  const files: string[] = [];
  collectFiles(join(projectRoot, "src"), files);
  collectFiles(join(projectRoot, ".github", "workflows"), files);

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf8");
    const relative = filePath.replace(projectRoot, "").replace(/^[/\\]/, "");

    if (content.includes("eval(")) {
      findings.push({
        id: "BOUNDARY-001",
        severity: "error",
        path: relative,
        message: "Forbidden eval() usage at system boundary.",
        remediation: "Remove eval and validate external input with typed parsers.",
      });
    }

    if (
      relative.includes(".github/workflows") &&
      (content.includes("--no-verify") || content.includes("HARNESS_SKIP_CHECKS"))
    ) {
      findings.push({
        id: "HARNESS-001",
        severity: "error",
        path: relative,
        message: "CI workflow attempts to bypass harness checks.",
        remediation: "Remove skip hooks; harness checks must not be disabled in CI.",
      });
    }

    if (relative.startsWith("src/") && content.match(/from\s+["'].*\/infrastructure\//)) {
      findings.push({
        id: "ARCH-001",
        severity: "error",
        path: relative,
        message: "Layer violation: upper layer imports infrastructure directly.",
        remediation: "Route cross-layer access through public module boundaries.",
      });
    }
  }

  if (
    existsSync(join(projectRoot, "harness.lock.json")) &&
    !existsSync(join(projectRoot, "harness.config.ts"))
  ) {
    findings.push({
      id: "HARNESS-001",
      severity: "error",
      path: "harness.config.ts",
      message: "harness.lock.json present without harness.config.ts.",
      remediation: "Restore harness.config.ts or regenerate via harness init.",
    });
  }

  return buildValidationResult(findings);
}
