import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { WorktreeEnvironmentRecord } from "./types.js";

const ENV_DIR = ".harness/env";
const BASE_APP_PORT = 41000;
const BASE_DB_PORT = 42000;

function envDir(projectRoot: string): string {
  return join(resolve(projectRoot), ENV_DIR);
}

function recordPath(projectRoot: string, worktreeId: string): string {
  return join(envDir(projectRoot), `${worktreeId}.json`);
}

/**
 * Derives a stable worktree identifier from project root path.
 *
 * @param projectRoot - Worktree project root.
 * @returns Short stable worktree id.
 */
export function deriveWorktreeId(projectRoot: string): string {
  const override = process.env.HARNESS_WORKTREE_ID;
  if (override) {
    return override;
  }

  return createHash("sha256").update(resolve(projectRoot)).digest("hex").slice(0, 12);
}

function allocatePorts(worktreeId: string): { appPort: number; databasePort: number } {
  const offset = parseInt(worktreeId.slice(0, 6), 16) % 500;
  return {
    appPort: BASE_APP_PORT + offset,
    databasePort: BASE_DB_PORT + offset,
  };
}

/**
 * Loads a worktree environment record when present.
 *
 * @param projectRoot - Project root containing `.harness/env`.
 * @param worktreeId - Worktree identifier.
 */
export function loadEnvironmentRecord(
  projectRoot: string,
  worktreeId: string,
): WorktreeEnvironmentRecord | undefined {
  const path = recordPath(projectRoot, worktreeId);
  if (!existsSync(path)) {
    return undefined;
  }

  return JSON.parse(readFileSync(path, "utf8")) as WorktreeEnvironmentRecord;
}

/**
 * Persists a worktree environment record.
 *
 * @param record - Environment record to save.
 */
export function saveEnvironmentRecord(record: WorktreeEnvironmentRecord): void {
  const dir = envDir(record.projectRoot);
  mkdirSync(dir, { recursive: true });
  writeFileSync(recordPath(record.projectRoot, record.worktreeId), JSON.stringify(record, null, 2));
}

/**
 * Provisions isolated ports and DB boundary for a worktree (idempotent).
 *
 * @param projectRoot - Worktree project root.
 * @param worktreeId - Optional explicit worktree id.
 * @returns Provisioned environment record.
 */
export function provisionEnvironment(
  projectRoot: string,
  worktreeId?: string,
): WorktreeEnvironmentRecord {
  const resolvedRoot = resolve(projectRoot);
  const id = worktreeId ?? deriveWorktreeId(resolvedRoot);
  const existing = loadEnvironmentRecord(resolvedRoot, id);

  if (existing?.status === "up") {
    return existing;
  }

  const { appPort, databasePort } = allocatePorts(id);
  const databaseName = `harness_${id}`;

  const record: WorktreeEnvironmentRecord = {
    worktreeId: id,
    projectRoot: resolvedRoot,
    appPort,
    databasePort,
    databaseName,
    status: "up",
    taggedResources: [
      `port:${appPort}`,
      `port:${databasePort}`,
      `database:${databaseName}`,
    ],
    updatedAt: new Date().toISOString(),
  };

  saveEnvironmentRecord(record);
  return record;
}
