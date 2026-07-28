export interface ExecPlanScopeManifest {
  planId: string;
  version: string;
  exclusivePaths: string[];
  owner: string;
}

export type ScopeConflict =
  | { ok: true }
  | { ok: false; reason: string; conflictingPlanId: string };

/**
 * ExecPlan scope coordination (HP6).
 */
export class ScopeCoordinator {
  private readonly active = new Map<string, ExecPlanScopeManifest>();

  register(manifest: ExecPlanScopeManifest): ScopeConflict {
    for (const [planId, existing] of this.active) {
      if (planId === manifest.planId) {
        continue;
      }
      const overlap = manifest.exclusivePaths.some((path) =>
        existing.exclusivePaths.includes(path),
      );
      if (overlap) {
        return {
          ok: false,
          reason: "Concurrent exclusive scope overlap",
          conflictingPlanId: planId,
        };
      }
    }
    this.active.set(manifest.planId, manifest);
    return { ok: true };
  }

  release(planId: string): void {
    this.active.delete(planId);
  }
}
