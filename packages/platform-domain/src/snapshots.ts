export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "REVOKED";

export interface SnapshotRecord {
  snapshotId: string;
  sha: string;
  status: VerificationStatus;
  verifiedAt?: string;
  revokedAt?: string;
  revokeReason?: string;
}

/**
 * Snapshot verification and revocation policy (HP9).
 */
export class SnapshotPolicy {
  private readonly snapshots = new Map<string, SnapshotRecord>();

  verify(snapshotId: string, sha: string, criteriaPass: boolean): SnapshotRecord {
    const status: VerificationStatus = criteriaPass ? "VERIFIED" : "UNVERIFIED";
    const record: SnapshotRecord = {
      snapshotId,
      sha,
      status,
      verifiedAt: criteriaPass ? new Date().toISOString() : undefined,
    };
    this.snapshots.set(snapshotId, record);
    return record;
  }

  revoke(snapshotId: string, reason: string): SnapshotRecord | undefined {
    const existing = this.snapshots.get(snapshotId);
    if (!existing) {
      return undefined;
    }
    const updated: SnapshotRecord = {
      ...existing,
      status: "REVOKED",
      revokedAt: new Date().toISOString(),
      revokeReason: reason,
    };
    this.snapshots.set(snapshotId, updated);
    return updated;
  }

  get(snapshotId: string): SnapshotRecord | undefined {
    return this.snapshots.get(snapshotId);
  }
}
