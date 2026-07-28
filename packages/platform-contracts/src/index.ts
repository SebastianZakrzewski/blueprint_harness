/** Platform public contract surface (HP1 scaffold). */
export const PLATFORM_CONTRACTS_VERSION = "0.0.0" as const;

export {
  RESULT_ENVELOPE_SCHEMA_ID,
  ENVELOPE_PARSE_CODES,
  buildResultEnvelope,
  canonicalSerialize,
  computePayloadHash,
  deriveIdempotencyKey,
  parseResultEnvelope,
  type EnvelopeFinding,
  type EnvelopeParseCode,
  type EnvelopeParseError,
  type EnvelopeParseResult,
  type EnvelopeParseSuccess,
  type ResultEnvelopeV1,
} from "./envelope.js";
