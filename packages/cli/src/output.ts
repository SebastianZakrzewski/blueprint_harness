import type { Finding, ValidationResult } from "@blueprint-harness/core";

export type OutputFormat = "human" | "json";

/**
 * Formats a validation result for human or JSON CLI output.
 *
 * @param result - Validation result to format.
 * @param format - Output format.
 * @returns Formatted string (JSON or human-readable lines).
 */
export function formatValidationResult(
  result: ValidationResult,
  format: OutputFormat,
): string {
  if (format === "json") {
    return JSON.stringify(result);
  }

  if (result.findings.length === 0) {
    return "OK (no findings)";
  }

  return result.findings
    .map((finding: Finding) => {
      const location = finding.path ? `${finding.path}: ` : "";
      return `${finding.severity.toUpperCase()} [${finding.id}] ${location}${finding.message}`;
    })
    .join("\n");
}

/**
 * Writes formatted output to stdout/stderr and returns process exit code.
 *
 * @param result - Validation result driving exit code.
 * @param format - Output format.
 * @param label - Optional command label prefix for human output.
 * @returns 0 when ok, 1 when blocking findings exist.
 */
export function emitValidationResult(
  result: ValidationResult,
  format: OutputFormat,
  label?: string,
): number {
  const body = formatValidationResult(result, format);
  const output = label && format === "human" ? `${label}: ${body}` : body;

  if (result.ok) {
    console.log(output);
    return 0;
  }

  console.error(output);
  return 1;
}
