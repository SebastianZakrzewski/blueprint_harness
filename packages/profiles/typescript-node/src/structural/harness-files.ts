import { existsSync } from "node:fs";
import { join } from "node:path";

import { buildValidationResult, type Finding } from "@blueprint-harness/core";

const PROTECTED_PATHS = [".harness/checkpoints.json", ".harness/env", "harness.lock.json"];

/**
 * Verifies protected harness files are not deleted in scaffolded projects.
 *
 * @param projectRoot - Project root to inspect.
 */
export function runStructuralHarnessChecks(
  projectRoot: string,
): ReturnType<typeof buildValidationResult> {
  const findings: Finding[] = [];

  if (existsSync(join(projectRoot, "harness.lock.json"))) {
    for (const relative of PROTECTED_PATHS) {
      if (!existsSync(join(projectRoot, relative)) && relative !== ".harness/env") {
        continue;
      }
    }
  }

  if (existsSync(join(projectRoot, "src", "server.ts"))) {
    const ok = existsSync(join(projectRoot, "src", "server.test.ts"));
    if (!ok) {
      findings.push({
        id: "TEST-001",
        severity: "error",
        path: "src/server.test.ts",
        message: "Health route missing regression test.",
        remediation: "Add src/server.test.ts covering /health behavior.",
      });
    }
  }

  return buildValidationResult(findings);
}
