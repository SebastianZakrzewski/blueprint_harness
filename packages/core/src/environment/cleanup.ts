import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { loadEnvironmentRecord, saveEnvironmentRecord } from "./provision.js";
import { deriveWorktreeId } from "./provision.js";
import type { WorktreeEnvironmentRecord } from "./types.js";

/**
 * Removes only tagged resources for the worktree environment (M10-AC3).
 *
 * @param projectRoot - Worktree project root.
 * @param worktreeId - Optional explicit worktree id.
 * @returns Updated record or undefined when no record existed.
 */
export function cleanupEnvironment(
  projectRoot: string,
  worktreeId?: string,
): WorktreeEnvironmentRecord | undefined {
  const resolvedRoot = resolve(projectRoot);
  const id = worktreeId ?? deriveWorktreeId(resolvedRoot);
  const existing = loadEnvironmentRecord(resolvedRoot, id);

  if (!existing) {
    return undefined;
  }

  for (const resource of existing.taggedResources) {
    if (resource.startsWith("port:") || resource.startsWith("database:")) {
      continue;
    }

    const path = resource;
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
    }
  }

  const downRecord: WorktreeEnvironmentRecord = {
    ...existing,
    status: "down",
    taggedResources: [],
    updatedAt: new Date().toISOString(),
  };

  saveEnvironmentRecord(downRecord);
  return downRecord;
}
