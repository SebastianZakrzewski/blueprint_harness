import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { buildValidationResult, type Finding } from "@blueprint-harness/core";

function collectTsFiles(dir: string, out: string[]): void {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsFiles(full, out);
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
}

/**
 * Detects duplicate instrumentation providers in observability-enabled projects.
 *
 * @param projectRoot - Project root to scan.
 */
export function runObservabilityLint(
  projectRoot: string,
): ReturnType<typeof buildValidationResult> {
  const findings: Finding[] = [];
  const files: string[] = [];
  collectTsFiles(join(projectRoot, "src"), files);

  let otelImports = 0;
  let harnessTelemetryImports = 0;

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf8");
    if (content.includes("@opentelemetry/")) {
      otelImports += 1;
    }
    if (content.includes("createTelemetryProvider")) {
      harnessTelemetryImports += 1;
    }
  }

  if (otelImports > 0 && harnessTelemetryImports > 0) {
    findings.push({
      id: "OBS-001",
      severity: "error",
      path: "src",
      message: "Duplicate instrumentation paths detected (OpenTelemetry + harness telemetry).",
      remediation: "Use the single harness telemetry provider for this profile.",
    });
  }

  return buildValidationResult(findings);
}
