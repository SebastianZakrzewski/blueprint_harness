import { RESULT_ENVELOPE_SCHEMA_ID } from "@blueprint-harness/platform-contracts";

export { ArchitectureProjector } from "./architecture.js";
export type { ArchitectureNode, ArchitectureProjection } from "./architecture.js";
export { CriteriaEngine } from "./criteria.js";
export type { CriteriaRegistry, CriterionStatus } from "./criteria.js";
export { EvidenceIndex } from "./evidence.js";
export type { EvidenceManifest } from "./evidence.js";
export { EventHistory } from "./ingestion.js";
export type { AcceptedEvent, IngestOutcome } from "./ingestion.js";
export { DurableOutbox, HarnessResultReporter } from "./outbox.js";
export type { DeliveryStatus, OutboxRecord, ReporterOptions } from "./outbox.js";
export { Projector } from "./projectors.js";
export type { ReadModelSnapshot } from "./projectors.js";
export { Reconciler } from "./reconciliation.js";
export type { FreshnessState, ReconciliationState } from "./reconciliation.js";
export { ScopeCoordinator } from "./scope.js";
export type { ExecPlanScopeManifest, ScopeConflict } from "./scope.js";
export { SnapshotPolicy } from "./snapshots.js";
export type { SnapshotRecord, VerificationStatus } from "./snapshots.js";

/** Domain policy entry point. */
export function supportedEnvelopeSchemaId(): string {
  return RESULT_ENVELOPE_SCHEMA_ID;
}
