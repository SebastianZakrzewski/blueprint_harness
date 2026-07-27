import { buildValidationResult, type ValidationResult } from "../validation-result.js";
import { loadReleaseManifest, readArtifactContent, verifyArtifactBytes } from "../release/index.js";
import { getRolloutControlState } from "./freeze.js";

/**
 * Verifies recovery after rollback by checking artifact integrity and rollout state.
 *
 * @param projectRoot - Project root with release manifest.
 */
export function verifyRecoveryAfterRollback(projectRoot: string): ValidationResult {
  const manifest = loadReleaseManifest(projectRoot);
  if (!manifest) {
    return buildValidationResult([
      {
        id: "RECOVERY-002",
        severity: "error",
        message: "Recovery verification requires a release manifest.",
      },
    ]);
  }

  const artifact = manifest.history.find((entry) => entry.id === manifest.currentArtifactId);
  const content = readArtifactContent(projectRoot, manifest.currentArtifactId);

  if (!artifact || !content || !verifyArtifactBytes(artifact, content)) {
    return buildValidationResult([
      {
        id: "RECOVERY-003",
        severity: "error",
        message: "Recovery verification failed: restored artifact checksum mismatch.",
      },
    ]);
  }

  if (manifest.state !== "ROLLED_BACK" && manifest.state !== "STAGING_VERIFIED") {
    return buildValidationResult([
      {
        id: "RECOVERY-004",
        severity: "error",
        message: `Recovery expected ROLLED_BACK or STAGING_VERIFIED, got ${manifest.state}.`,
      },
    ]);
  }

  return buildValidationResult([
    {
      id: "RECOVERY-005",
      severity: "info",
      message: `Recovery verified for artifact ${artifact.id}; rollout=${getRolloutControlState()}.`,
    },
  ]);
}
