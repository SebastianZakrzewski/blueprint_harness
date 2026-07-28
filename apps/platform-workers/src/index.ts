import { RESULT_ENVELOPE_SCHEMA_ID } from "@blueprint-harness/platform-contracts";

/** Background worker entry (HP1 scaffold). */
export function workerReady(): { ready: true; schemaId: string } {
  return { ready: true, schemaId: RESULT_ENVELOPE_SCHEMA_ID };
}
