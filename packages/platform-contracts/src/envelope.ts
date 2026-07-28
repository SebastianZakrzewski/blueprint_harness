import { createHash } from "node:crypto";

export const RESULT_ENVELOPE_SCHEMA_ID = "result-envelope@1" as const;

export interface EnvelopeFinding {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
}

/** Canonical Harness result envelope (v1). */
export interface ResultEnvelopeV1 {
  schemaVersion: typeof RESULT_ENVELOPE_SCHEMA_ID;
  eventId: string;
  eventType: string;
  projectId: string;
  repositoryId: string;
  branch?: string;
  sha: string;
  run: {
    runId: string;
    attempt: number;
    trigger: string;
    startedAt: string;
    completedAt?: string;
  };
  producer: {
    type: string;
    id: string;
    version: string;
  };
  validation?: {
    validationId: string;
    status: "PASS" | "FAIL" | "ERROR" | "CANCELLED" | "SKIPPED";
    mode: string;
    configChecksum: string;
    policyVersion?: string;
  };
  criteriaIds: string[];
  findings: EnvelopeFinding[];
  artifactReferences: { artifactId: string; checksum: string }[];
  observedAt: string;
  payloadHash: string;
}

export const ENVELOPE_PARSE_CODES = {
  INVALID_JSON: "ENVELOPE_INVALID_JSON",
  UNSUPPORTED_SCHEMA: "ENVELOPE_UNSUPPORTED_SCHEMA",
  MISSING_FIELD: "ENVELOPE_MISSING_FIELD",
  INVALID_SHA: "ENVELOPE_INVALID_SHA",
  HASH_MISMATCH: "ENVELOPE_HASH_MISMATCH",
  SENSITIVE_CONTENT: "ENVELOPE_SENSITIVE_CONTENT",
} as const;

export type EnvelopeParseCode =
  (typeof ENVELOPE_PARSE_CODES)[keyof typeof ENVELOPE_PARSE_CODES];

export interface EnvelopeParseError {
  ok: false;
  code: EnvelopeParseCode;
  message: string;
}

export interface EnvelopeParseSuccess {
  ok: true;
  envelope: ResultEnvelopeV1;
  idempotencyKey: string;
}

export type EnvelopeParseResult = EnvelopeParseSuccess | EnvelopeParseError;

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const SENSITIVE_PATTERN = /(api[_-]?key|secret|password|token)\s*[:=]/i;

/**
 * Derives deterministic idempotency identity for an envelope.
 */
export function deriveIdempotencyKey(envelope: ResultEnvelopeV1): string {
  return [
    envelope.projectId,
    envelope.run.runId,
    String(envelope.run.attempt),
    envelope.eventType,
    envelope.producer.id,
    envelope.sha,
  ].join("|");
}

/**
 * Canonical JSON serialization for stable hashing.
 */
export function canonicalSerialize(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortKeys(record[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Computes payload hash from envelope content excluding payloadHash field.
 */
export function computePayloadHash(envelope: Omit<ResultEnvelopeV1, "payloadHash">): string {
  const body = canonicalSerialize(envelope);
  return createHash("sha256").update(body, "utf8").digest("hex");
}

function hasRequiredEnvelopeFields(
  value: Record<string, unknown>,
): value is Record<string, unknown> & { schemaVersion: string; sha: string } {
  const required = [
    "schemaVersion",
    "eventId",
    "eventType",
    "projectId",
    "repositoryId",
    "sha",
    "run",
    "producer",
    "observedAt",
    "payloadHash",
  ];
  return required.every((key) => value[key] !== undefined && value[key] !== null);
}

/**
 * Parses and validates a result envelope at the Platform boundary.
 */
export function parseResultEnvelope(raw: string): EnvelopeParseResult {
  if (SENSITIVE_PATTERN.test(raw)) {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.SENSITIVE_CONTENT,
      message: "Envelope contains sensitive content patterns",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.INVALID_JSON,
      message: "Envelope is not valid JSON",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.INVALID_JSON,
      message: "Envelope must be a JSON object",
    };
  }

  const record = parsed as Record<string, unknown>;

  if (record.schemaVersion !== RESULT_ENVELOPE_SCHEMA_ID) {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.UNSUPPORTED_SCHEMA,
      message: `Unsupported schemaVersion: ${String(record.schemaVersion)}`,
    };
  }

  if (!hasRequiredEnvelopeFields(record)) {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.MISSING_FIELD,
      message: "Envelope missing required fields",
    };
  }

  if (typeof record.sha !== "string" || !SHA_PATTERN.test(record.sha)) {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.INVALID_SHA,
      message: "commitSha must be a full 40-character hex SHA",
    };
  }

  const envelope = record as unknown as ResultEnvelopeV1;
  const { payloadHash, ...withoutHash } = envelope;
  const expected = computePayloadHash(withoutHash);

  if (payloadHash !== expected) {
    return {
      ok: false,
      code: ENVELOPE_PARSE_CODES.HASH_MISMATCH,
      message: "payloadHash does not match canonical content",
    };
  }

  return {
    ok: true,
    envelope,
    idempotencyKey: deriveIdempotencyKey(envelope),
  };
}

/**
 * Serializes envelope with recomputed payload hash.
 */
export function buildResultEnvelope(
  input: Omit<ResultEnvelopeV1, "payloadHash" | "schemaVersion">,
): ResultEnvelopeV1 {
  const base = { ...input, schemaVersion: RESULT_ENVELOPE_SCHEMA_ID };
  return { ...base, payloadHash: computePayloadHash(base) };
}
