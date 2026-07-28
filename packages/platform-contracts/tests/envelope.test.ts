import { describe, expect, it } from "vitest";

import {
  buildResultEnvelope,
  ENVELOPE_PARSE_CODES,
  parseResultEnvelope,
  RESULT_ENVELOPE_SCHEMA_ID,
} from "../src/envelope.js";

function sampleInput() {
  return {
    eventId: "evt-1",
    eventType: "harness.check.completed",
    projectId: "proj-1",
    repositoryId: "repo-1",
    sha: "a".repeat(40),
    run: {
      runId: "run-1",
      attempt: 1,
      trigger: "ci",
      startedAt: "2026-07-28T00:00:00.000Z",
      completedAt: "2026-07-28T00:00:05.000Z",
    },
    producer: { type: "harness-cli", id: "cli", version: "0.0.0" },
    validation: {
      validationId: "val-1",
      status: "PASS" as const,
      mode: "fast",
      configChecksum: "cfg",
    },
    criteriaIds: ["PLATFORM-AC-005"],
    findings: [],
    artifactReferences: [],
    observedAt: "2026-07-28T00:00:05.000Z",
  };
}

describe("result envelope (HP2)", () => {
  it("round-trips without semantic loss (HP2-AC1)", () => {
    const built = buildResultEnvelope(sampleInput());
    const parsed = parseResultEnvelope(JSON.stringify(built));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.envelope).toEqual(built);
    }
  });

  it("rejects unsupported schema (HP2-AC2)", () => {
    const built = buildResultEnvelope(sampleInput());
    const mutated = { ...built, schemaVersion: "result-envelope@99" };
    const parsed = parseResultEnvelope(JSON.stringify(mutated));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.code).toBe(ENVELOPE_PARSE_CODES.UNSUPPORTED_SCHEMA);
    }
  });

  it("requires full sha (HP2-AC3)", () => {
    const built = buildResultEnvelope(sampleInput());
    const invalid = { ...built, sha: "short" };
    const parsed = parseResultEnvelope(JSON.stringify(invalid));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.code).toBe(ENVELOPE_PARSE_CODES.INVALID_SHA);
    }
  });

  it("uses deterministic payload hash (HP2-AC4)", () => {
    const a = buildResultEnvelope(sampleInput());
    const b = buildResultEnvelope(sampleInput());
    expect(a.payloadHash).toBe(b.payloadHash);
    expect(a.payloadHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects sensitive content (HP2-AC5)", () => {
    const built = buildResultEnvelope({
      ...sampleInput(),
      findings: [{ id: "F1", severity: "error", message: "api_key=leaked" }],
    });
    const parsed = parseResultEnvelope(JSON.stringify(built));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.code).toBe(ENVELOPE_PARSE_CODES.SENSITIVE_CONTENT);
    }
  });

  it("exports stable schema id", () => {
    expect(RESULT_ENVELOPE_SCHEMA_ID).toBe("result-envelope@1");
  });
});
