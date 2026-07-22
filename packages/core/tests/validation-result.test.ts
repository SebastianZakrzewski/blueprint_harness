import { describe, expect, it } from "vitest";

import {
  ValidationResultParseError,
  deserializeValidationResult,
  hasBlockingFindings,
  serializeValidationResult,
  type ValidationResult,
} from "../src/validation-result.js";
import { readFixture } from "./read-fixture.js";

describe("validation-result", () => {
  it("round-trips ValidationResult without data loss", () => {
    const fixture = readFixture<ValidationResult>(
      "validation-result-roundtrip.json",
    );

    const parsed = deserializeValidationResult(fixture);
    const serialized = serializeValidationResult(parsed);
    const roundTripped = deserializeValidationResult(JSON.parse(serialized));

    expect(roundTripped).toEqual(parsed);
    expect(parsed.ok).toBe(false);
    expect(parsed.findings).toHaveLength(2);
    expect(parsed.findings[0]?.remediation).toContain("Surprises");
  });

  it("detects blocking error findings", () => {
    const result = deserializeValidationResult(
      readFixture("validation-result-roundtrip.json"),
    );

    expect(hasBlockingFindings(result)).toBe(true);
  });

  it("throws ValidationResultParseError on invalid input", () => {
    expect(() => deserializeValidationResult({ ok: "yes", findings: [] })).toThrow(
      ValidationResultParseError,
    );
    expect(() => deserializeValidationResult(null)).toThrow(
      ValidationResultParseError,
    );
  });

  it("does not reconcile ok with findings at the M1 schema layer", () => {
    const result = deserializeValidationResult({
      ok: true,
      findings: [
        {
          id: "DOC-001",
          severity: "error",
          message: "blocking despite ok true",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(hasBlockingFindings(result)).toBe(true);
  });
});
