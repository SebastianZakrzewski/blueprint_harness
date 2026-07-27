/**
 * Universal Harness Core — public API barrel export.
 */

export { packageIdentity } from "./package-identity.js";

export {
  INVARIANT_CATALOG,
  INVARIANT_COUNT,
  INVARIANT_IDS,
  isInvariantId,
  type InvariantCatalog,
  type InvariantId,
} from "./invariants.js";

export {
  BOOTSTRAP_STATE_COUNT,
  BOOTSTRAP_STATE_ORDER,
  isBootstrapState,
  isUpgradePhase,
  isValidBootstrapTransition,
  type BootstrapState,
  type UpgradePhase,
} from "./lifecycle.js";

export {
  ValidationResultParseError,
  buildValidationResult,
  deserializeValidationResult,
  hasBlockingFindings,
  parseFinding,
  serializeValidationResult,
  type Finding,
  type Severity,
  type ValidationResult,
} from "./validation-result.js";

export {
  createFileOwnershipMetadata,
  isFileOwnershipClass,
  type FileOwnershipClass,
  type FileOwnershipMetadata,
} from "./ownership.js";

export {
  createDefaultPolicyEvaluator,
  type AutonomyLevel,
  type PolicyDimension,
  type PolicyEvaluator,
} from "./policy.js";

export {
  createAuditEvent,
  type AuditEvent,
  type AuditEventInput,
  type AuditEventType,
} from "./audit.js";

export {
  canResumeFrom,
  getResumeState,
  recordCheckpoint,
  type Checkpoint,
  type CheckpointEvidence,
} from "./checkpoint.js";
