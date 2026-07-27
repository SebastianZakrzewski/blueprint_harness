import { resolve } from "node:path";

import { loadEnvironmentRecord } from "./provision.js";
import { deriveWorktreeId } from "./provision.js";
import type { WorktreeEnvironmentStatus } from "./types.js";

/**
 * Returns environment health summary without secrets (M10-AC2).
 *
 * @param projectRoot - Worktree project root.
 * @param worktreeId - Optional explicit worktree id.
 */
export function getEnvironmentStatus(
  projectRoot: string,
  worktreeId?: string,
): WorktreeEnvironmentStatus {
  const resolvedRoot = resolve(projectRoot);
  const id = worktreeId ?? deriveWorktreeId(resolvedRoot);
  const record = loadEnvironmentRecord(resolvedRoot, id);

  if (!record) {
    return {
      worktreeId: id,
      status: "down",
      appPort: 0,
      databasePort: 0,
      databaseName: "",
      health: "down",
      taggedResourceCount: 0,
    };
  }

  return {
    worktreeId: record.worktreeId,
    status: record.status,
    appPort: record.appPort,
    databasePort: record.databasePort,
    databaseName: record.databaseName,
    health: record.status === "up" ? "ok" : "degraded",
    taggedResourceCount: record.taggedResources.length,
  };
}
