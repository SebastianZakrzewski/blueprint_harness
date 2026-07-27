import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { ReleaseArtifact } from "./artifact.js";
import type { ReleaseState } from "./state.js";

const RELEASE_DIR = ".harness/release";

/** Persisted release manifest for staging/production promotion. */
export interface ReleaseManifest {
  currentArtifactId: string;
  state: ReleaseState;
  history: ReleaseArtifact[];
  stagingComposePath: string;
  updatedAt: string;
}

function releaseRoot(projectRoot: string): string {
  return join(resolve(projectRoot), RELEASE_DIR);
}

function manifestPath(projectRoot: string): string {
  return join(releaseRoot(projectRoot), "manifest.json");
}

/**
 * Loads the release manifest when present.
 *
 * @param projectRoot - Project root.
 */
export function loadReleaseManifest(projectRoot: string): ReleaseManifest | undefined {
  const path = manifestPath(projectRoot);
  if (!existsSync(path)) {
    return undefined;
  }

  return JSON.parse(readFileSync(path, "utf8")) as ReleaseManifest;
}

/**
 * Persists the release manifest.
 *
 * @param projectRoot - Project root.
 * @param manifest - Manifest to save.
 */
export function saveReleaseManifest(projectRoot: string, manifest: ReleaseManifest): void {
  const root = releaseRoot(projectRoot);
  mkdirSync(root, { recursive: true });
  writeFileSync(manifestPath(projectRoot), JSON.stringify(manifest, null, 2));
}

/**
 * Returns artifact content path under `.harness/release/artifacts`.
 *
 * @param projectRoot - Project root.
 * @param artifactId - Artifact identifier.
 */
export function artifactContentPath(projectRoot: string, artifactId: string): string {
  return join(releaseRoot(projectRoot), "artifacts", `${artifactId}.artifact`);
}

/**
 * Writes artifact bytes to the immutable artifact store.
 *
 * @param projectRoot - Project root.
 * @param artifact - Artifact metadata and content.
 */
export function persistArtifact(projectRoot: string, artifact: ReleaseArtifact): void {
  const dir = join(releaseRoot(projectRoot), "artifacts");
  mkdirSync(dir, { recursive: true });
  writeFileSync(artifactContentPath(projectRoot, artifact.id), artifact.content, "utf8");
}

/**
 * Reads artifact bytes from the immutable artifact store.
 *
 * @param projectRoot - Project root.
 * @param artifactId - Artifact identifier.
 */
export function readArtifactContent(projectRoot: string, artifactId: string): string | undefined {
  const path = artifactContentPath(projectRoot, artifactId);
  if (!existsSync(path)) {
    return undefined;
  }

  return readFileSync(path, "utf8");
}
