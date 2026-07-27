import { describe, expect, it } from "vitest";

import {
  ValidationResultParseError,
  buildValidationResult,
  deserializeValidationResult,
  hasBlockingFindings,
  serializeValidationResult,
  type Finding,
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

  it("buildValidationResult sets ok false only when error findings exist (PLAN-005 Model A)", () => {
    expect(buildValidationResult([]).ok).toBe(true);
    expect(
      buildValidationResult([
        { id: "DOC-001", severity: "warning", message: "minor issue" },
      ]).ok,
    ).toBe(true);
    expect(
      buildValidationResult([
        { id: "DOC-001", severity: "info", message: "note" },
      ]).ok,
    ).toBe(true);

    const blocking: Finding[] = [
      {
        id: "DOC-001",
        severity: "error",
        message: "missing required heading",
      },
    ];
    const mixed: Finding[] = [
      blocking[0],
      { id: "DOC-002", severity: "warning", message: "optional fix" },
    ];

    expect(buildValidationResult(blocking).ok).toBe(false);
    expect(buildValidationResult(mixed).ok).toBe(false);
    expect(hasBlockingFindings(buildValidationResult(blocking))).toBe(true);
    expect(hasBlockingFindings(buildValidationResult(mixed))).toBe(true);
  });

  it("does not reconcile ok with findings when deserializing external JSON", () => {
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
