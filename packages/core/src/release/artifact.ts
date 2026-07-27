import { createHash } from "node:crypto";

/** Immutable release artifact with checksum identity. */
export interface ReleaseArtifact {
  id: string;
  checksum: string;
  content: string;
  createdAt: string;
}

/**
 * Computes SHA-256 checksum for artifact bytes.
 *
 * @param content - Artifact payload.
 */
export function computeArtifactChecksum(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

/**
 * Creates a release artifact with stable checksum identity.
 *
 * @param content - Artifact payload bytes as UTF-8 string.
 * @param id - Optional explicit artifact id.
 */
export function createReleaseArtifact(content: string, id?: string): ReleaseArtifact {
  const checksum = computeArtifactChecksum(content);
  return {
    id: id ?? checksum.slice(0, 12),
    checksum,
    content,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Verifies artifact content matches recorded checksum.
 *
 * @param artifact - Stored artifact metadata.
 * @param content - Candidate content bytes.
 */
export function verifyArtifactBytes(artifact: ReleaseArtifact, content: string): boolean {
  return artifact.checksum === computeArtifactChecksum(content);
}
