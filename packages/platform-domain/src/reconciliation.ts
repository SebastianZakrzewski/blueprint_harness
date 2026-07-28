export type FreshnessState = "CURRENT" | "DATA_STALE" | "SOURCE_GAP";

export interface ReconciliationState {
  projectId: string;
  sha: string;
  freshness: FreshnessState;
  lastReconciledAt: string;
}

/**
 * Reconciliation and freshness semantics (HP11).
 */
export class Reconciler {
  reconcile(input: {
    projectId: string;
    sha: string;
    sourceEventCount: number;
    projectedEventCount: number;
    staleAfterMs: number;
    lastUpdateAt: string;
  }): ReconciliationState {
    const now = Date.now();
    const updatedAt = Date.parse(input.lastUpdateAt);
    const ageMs = now - updatedAt;

    let freshness: FreshnessState = "CURRENT";
    if (input.sourceEventCount > input.projectedEventCount) {
      freshness = "SOURCE_GAP";
    } else if (ageMs > input.staleAfterMs) {
      freshness = "DATA_STALE";
    }

    return {
      projectId: input.projectId,
      sha: input.sha,
      freshness,
      lastReconciledAt: new Date().toISOString(),
    };
  }
}
