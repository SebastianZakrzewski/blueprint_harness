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

export { validateDocsStructure } from "./docs-validator.js";

export {
  FINDING_EXEC_MISSING_HEADING,
  FINDING_LAYOUT_MISSING_PATH,
  FINDING_LINK_BROKEN,
  FINDING_STATUS_MISSING,
} from "./docs-finding-ids.js";

export {
  REQUIRED_EXECPLAN_HEADINGS,
  extractMarkdownHeadings,
  extractTopLevelHeadings,
  lintExecPlanFile,
  lintExecPlans,
} from "./execplan-linter.js";

export {
  resolveRepoRoot,
  validateDocs,
  type ValidateDocsOptions,
} from "./validate-docs.js";

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

export {
  FINDING_INGEST_CONFLICT,
  FINDING_INGEST_DUPLICATE,
  FINDING_INGEST_MANIFEST_PROPOSED,
  FINDING_INGEST_MAPPING_PROPOSED,
  HUMAN_JUDGMENT_REQUIRED,
  detectDuplicateContent,
  ingestDocs,
  isCanonicalDocsLayout,
  inventoryDocs,
  inventoryDocsSync,
  proposeManifest,
  proposeMappings,
  readManifest,
  validateIngestionResult,
  type DocsIngestionResult,
  type DocsManifestEntry,
  type InventoryEntry,
  type ProposedMapping,
} from "./docs-ingestion/index.js";

export {
  runBootstrap,
  loadCheckpoints,
  saveCheckpoint,
  type BootstrapOptions,
  type BootstrapResult,
  type HarnessRenderContext,
  type HarnessRenderFn,
  type ScaffoldProfileFn,
} from "./bootstrap/index.js";

export {
  cleanupEnvironment,
  deriveWorktreeId,
  getEnvironmentStatus,
  provisionEnvironment,
  type WorktreeEnvironmentStatus,
} from "./environment/index.js";

export {
  MAX_CONTROLLED_CI_RERUNS,
  buildMergeReadinessReport,
  classifyCiFailure,
  evaluateRerunPolicy,
  parseMergeReadinessReport,
  serializeMergeReadinessReport,
  type CiFailureClassification,
  type CiFailureContext,
  type MergeReadinessInput,
  type MergeReadinessReport,
  type MergeReadinessStatus,
} from "./merge-readiness.js";

export {
  computeArtifactChecksum,
  createReleaseArtifact,
  deployStagingArtifact,
  getReleaseState,
  loadReleaseManifest,
  readArtifactContent,
  rollbackStagingArtifact,
  verifyArtifactBytes,
  verifyStagingDeployment,
  type ReleaseArtifact,
  type ReleaseManifest,
  type ReleaseState,
} from "./release/index.js";

export {
  applyMonitoringUnavailableFreeze,
  freezeAutonomy,
  getMonitoringState,
  getMonitoringStatus,
  getRolloutControlState,
  isProductionAutonomyBlocked,
  pauseRollout,
  resetMonitoringStatus,
  resetRolloutControl,
  setMonitoringStatus,
  verifyRecoveryAfterRollback,
  type MonitoringStatus,
  type RolloutControlState,
} from "./recovery/index.js";

export {
  attemptSelfPromotion,
  buildAutonomyStatusReport,
  evaluateAutonomyRequest,
  evaluatePermissionAction,
  isAutonomyFrozen,
  PRODUCTION_THRESHOLDS_DEFINED,
  resetAutonomyState,
  triggerAutonomyFreeze,
  type AutonomyStatusReport,
  type PermissionAction,
} from "./autonomy/index.js";

export {
  classifyUpgradeOwnership,
  compareHarnessLocks,
  readHarnessLock,
  runUpgrade,
  type HarnessLock,
  type RunUpgradeOptions,
  type UpgradeDiff,
  type UpgradeReport,
} from "./upgrade/index.js";
