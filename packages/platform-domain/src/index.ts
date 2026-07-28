import { RESULT_ENVELOPE_SCHEMA_ID } from "@blueprint-harness/platform-contracts";

/** Domain policy entry point (HP1 scaffold). */
export function supportedEnvelopeSchemaId(): string {
  return RESULT_ENVELOPE_SCHEMA_ID;
}
