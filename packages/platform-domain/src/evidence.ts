export interface EvidenceManifest {
  manifestId: string;
  sha: string;
  artifacts: { artifactId: string; checksum: string }[];
  complete: boolean;
}

/**
 * Evidence package index (HP8).
 */
export class EvidenceIndex {
  private readonly manifests = new Map<string, EvidenceManifest>();

  register(manifest: EvidenceManifest): { ok: true } | { ok: false; reason: string } {
    if (!manifest.complete || manifest.artifacts.length === 0) {
      return { ok: false, reason: "Incomplete evidence manifest" };
    }
    for (const artifact of manifest.artifacts) {
      if (!artifact.checksum) {
        return { ok: false, reason: "Missing artifact checksum" };
      }
    }
    this.manifests.set(manifest.manifestId, manifest);
    return { ok: true };
  }

  get(manifestId: string): EvidenceManifest | undefined {
    return this.manifests.get(manifestId);
  }
}
