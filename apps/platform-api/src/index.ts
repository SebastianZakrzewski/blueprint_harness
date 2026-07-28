import { supportedEnvelopeSchemaId } from "@blueprint-harness/platform-domain";

/** Query API application entry (HP1 health scaffold). */
export function healthStatus(): { ok: true; schemaId: string } {
  return { ok: true, schemaId: supportedEnvelopeSchemaId() };
}
