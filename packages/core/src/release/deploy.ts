import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

import { buildValidationResult, type Finding, type ValidationResult } from "../validation-result.js";
import { createReleaseArtifact, verifyArtifactBytes } from "./artifact.js";
import {
  artifactContentPath,
  loadReleaseManifest,
  persistArtifact,
  readArtifactContent,
  saveReleaseManifest,
  type ReleaseManifest,
} from "./manifest.js";
import type { ReleaseState } from "./state.js";

export interface StagingDeployResult {
  manifest: ReleaseManifest;
  artifactPath: string;
}

/**
 * Deploys an immutable artifact to staging (Compose path recorded, bytes stored).
 *
 * @param projectRoot - Project root.
 * @param buildOutput - Build artifact payload.
 * @param composePath - Relative path to staging compose file.
 */
export function deployStagingArtifact(
  projectRoot: string,
  buildOutput: string,
  composePath = "docker/compose.staging.yml",
): StagingDeployResult {
  const resolvedRoot = resolve(projectRoot);
  const artifact = createReleaseArtifact(buildOutput);
  persistArtifact(resolvedRoot, artifact);

  const existing = loadReleaseManifest(resolvedRoot);
  const history = existing?.history ?? [];

  if (!history.some((entry) => entry.id === artifact.id)) {
    history.push(artifact);
  }

  const manifest: ReleaseManifest = {
    currentArtifactId: artifact.id,
    state: "STAGING_DEPLOYED",
    history,
    stagingComposePath: composePath,
    updatedAt: new Date().toISOString(),
  };

  saveReleaseManifest(resolvedRoot, manifest);

  return {
    manifest,
    artifactPath: artifactContentPath(resolvedRoot, artifact.id),
  };
}

/**
 * Verifies staging deployment checksum and advances state to STAGING_VERIFIED.
 *
 * @param projectRoot - Project root.
 */
export function verifyStagingDeployment(projectRoot: string): ValidationResult {
  const manifest = loadReleaseManifest(projectRoot);
  if (!manifest) {
    return buildValidationResult([
      {
        id: "RELEASE-001",
        severity: "error",
        message: "No release manifest found for staging verification.",
      },
    ]);
  }

  const content = readArtifactContent(projectRoot, manifest.currentArtifactId);
  const artifact = manifest.history.find((entry) => entry.id === manifest.currentArtifactId);

  if (!content || !artifact || !verifyArtifactBytes(artifact, content)) {
    return buildValidationResult([
      {
        id: "RELEASE-002",
        severity: "error",
        message: "Staging artifact checksum verification failed.",
      },
    ]);
  }

  const composeFull = join(projectRoot, manifest.stagingComposePath);
  if (!existsSync(composeFull)) {
    return buildValidationResult([
      {
        id: "RELEASE-003",
        severity: "error",
        path: manifest.stagingComposePath,
        message: "Staging compose file is missing.",
      },
    ]);
  }

  manifest.state = "STAGING_VERIFIED";
  manifest.updatedAt = new Date().toISOString();
  saveReleaseManifest(projectRoot, manifest);

  return buildValidationResult([]);
}

/**
 * Rolls back staging to the previous verified artifact bytes.
 *
 * @param projectRoot - Project root.
 */
export function rollbackStagingArtifact(projectRoot: string): ValidationResult {
  const manifest = loadReleaseManifest(projectRoot);
  if (!manifest || manifest.history.length < 2) {
    return buildValidationResult([
      {
        id: "RELEASE-004",
        severity: "error",
        message: "No previous verified artifact available for rollback.",
      },
    ]);
  }

  const previous = manifest.history[manifest.history.length - 2];
  if (!previous) {
    return buildValidationResult([
      {
        id: "RELEASE-004",
        severity: "error",
        message: "No previous verified artifact available for rollback.",
      },
    ]);
  }

  const content = readArtifactContent(projectRoot, previous.id);

  if (!content || !verifyArtifactBytes(previous, content)) {
    return buildValidationResult([
      {
        id: "RELEASE-002",
        severity: "error",
        message: "Rollback artifact checksum verification failed.",
      },
    ]);
  }

  manifest.currentArtifactId = previous.id;
  manifest.state = "ROLLED_BACK";
  manifest.updatedAt = new Date().toISOString();
  saveReleaseManifest(projectRoot, manifest);

  const findings: Finding[] = [
    {
      id: "RELEASE-005",
      severity: "info",
      message: `Rollback restored artifact ${previous.id} with matching checksum.`,
    },
  ];

  return buildValidationResult(findings);
}

/**
 * Returns the current release state for gate tests.
 *
 * @param projectRoot - Project root.
 */
export function getReleaseState(projectRoot: string): ReleaseState | "NONE" {
  const manifest = loadReleaseManifest(projectRoot);
  return manifest?.state ?? "NONE";
}
