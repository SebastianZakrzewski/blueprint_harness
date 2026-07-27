/** Lifecycle status of an isolated worktree environment. */
export type EnvironmentStatus = "up" | "down" | "partial";

/** Persisted environment record for one worktree. */
export interface WorktreeEnvironmentRecord {
  worktreeId: string;
  projectRoot: string;
  appPort: number;
  databasePort: number;
  databaseName: string;
  status: EnvironmentStatus;
  taggedResources: string[];
  updatedAt: string;
}

/** Public status view without secrets (M10-AC2). */
export interface WorktreeEnvironmentStatus {
  worktreeId: string;
  status: EnvironmentStatus;
  appPort: number;
  databasePort: number;
  databaseName: string;
  health: "ok" | "degraded" | "down";
  taggedResourceCount: number;
}
