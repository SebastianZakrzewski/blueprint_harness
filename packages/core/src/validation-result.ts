/**
 * Machine-readable validation result schema shared across Core checks.
 */

/** Severity of a validation finding. */
export type Severity = "error" | "warning" | "info";

/** A single validation finding with stable ID and remediation guidance. */
export interface Finding {
  id: string;
  severity: Severity;
  path?: string;
  message: string;
  remediation?: string;
}

/**
 * Aggregate validation outcome with zero or more findings.
 *
 * Producer rule (PLAN-005, Model A): when building a result, use
 * `buildValidationResult` so `ok` is false when any finding has error severity.
 * Deserialization does not enforce this; external JSON may be inconsistent.
 */
export interface ValidationResult {
  ok: boolean;
  findings: Finding[];
}

/** Thrown when JSON cannot be parsed into a ValidationResult. */
export class ValidationResultParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationResultParseError";
  }
}

const SEVERITIES: ReadonlySet<string> = new Set(["error", "warning", "info"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSeverity(value: unknown): Severity {
  if (typeof value !== "string" || !SEVERITIES.has(value)) {
    throw new ValidationResultParseError(`Invalid severity: ${String(value)}`);
  }
  return value as Severity;
}

/**
 * Parses an unknown value into a Finding.
 *
 * Side effects: none.
 * Invariants: rejects non-objects and empty id/message strings.
 *
 * @param value - Candidate finding object.
 * @returns Typed Finding.
 * @throws ValidationResultParseError when shape is invalid.
 */
export function parseFinding(value: unknown): Finding {
  if (!isPlainObject(value)) {
    throw new ValidationResultParseError("Finding must be an object");
  }

  const { id, severity, path, message, remediation } = value;

  if (typeof id !== "string" || id.length === 0) {
    throw new ValidationResultParseError("Finding.id must be a non-empty string");
  }
  if (typeof message !== "string" || message.length === 0) {
    throw new ValidationResultParseError("Finding.message must be a non-empty string");
  }
  if (path !== undefined && typeof path !== "string") {
    throw new ValidationResultParseError("Finding.path must be a string when present");
  }
  if (remediation !== undefined && typeof remediation !== "string") {
    throw new ValidationResultParseError(
      "Finding.remediation must be a string when present",
    );
  }

  return {
    id,
    severity: parseSeverity(severity),
    ...(path !== undefined ? { path } : {}),
    message,
    ...(remediation !== undefined ? { remediation } : {}),
  };
}

/**
 * Parses an unknown value into a ValidationResult.
 *
 * Side effects: none.
 * Invariants: does not reconcile `ok` with `findings` severities (M1 schema only).
 *
 * @param value - Candidate validation result (typically parsed JSON).
 * @returns Typed ValidationResult.
 * @throws ValidationResultParseError when shape is invalid.
 */
export function deserializeValidationResult(value: unknown): ValidationResult {
  if (!isPlainObject(value)) {
    throw new ValidationResultParseError("ValidationResult must be an object");
  }

  const { ok, findings } = value;

  if (typeof ok !== "boolean") {
    throw new ValidationResultParseError("ValidationResult.ok must be a boolean");
  }
  if (!Array.isArray(findings)) {
    throw new ValidationResultParseError("ValidationResult.findings must be an array");
  }

  return {
    ok,
    findings: findings.map(parseFinding),
  };
}

/**
 * Serializes a ValidationResult to JSON.
 *
 * Side effects: none.
 *
 * @param result - Validation result to serialize.
 * @returns JSON string representation.
 */
export function serializeValidationResult(result: ValidationResult): string {
  return JSON.stringify(result);
}

/**
 * Returns true when the result contains at least one error-severity finding.
 *
 * Side effects: none.
 * Invariants: does not consult `ok`; blocking is derived from findings only.
 *
 * @param result - Validation result to inspect.
 * @returns True when a blocking error finding exists.
 */
export function hasBlockingFindings(result: ValidationResult): boolean {
  return result.findings.some((finding) => finding.severity === "error");
}

/**
 * Builds a ValidationResult from findings using PLAN-005 Model A semantics.
 *
 * `ok` is true when no finding has error severity; warnings and info do not
 * affect `ok`. M2 validate-docs producers and exit codes must use this helper
 * (or equivalent logic) so JSON and process status stay aligned.
 *
 * Side effects: none.
 *
 * @param findings - Collected validation findings from one or more validators.
 * @returns ValidationResult with `ok` derived from blocking findings.
 */
export function buildValidationResult(findings: Finding[]): ValidationResult {
  return {
    ok: !hasBlockingFindings({ ok: true, findings }),
    findings,
  };
}
