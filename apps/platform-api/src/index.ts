import { supportedEnvelopeSchemaId } from "@blueprint-harness/platform-domain";

export { QueryApiServer } from "./query-api.js";
export type { QueryApiOptions, QueryResource } from "./query-api.js";

/** Query API application entry. */
export function healthStatus(): { ok: true; schemaId: string } {
  return { ok: true, schemaId: supportedEnvelopeSchemaId() };
}
