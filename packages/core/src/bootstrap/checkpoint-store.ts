import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Checkpoint } from "../checkpoint.js";

const CHECKPOINT_DIR = ".harness";
const CHECKPOINT_FILE = "checkpoints.json";

interface CheckpointStore {
  checkpoints: Checkpoint[];
}

/**
 * Loads bootstrap checkpoint history from the target repository.
 *
 * @param targetDir - Bootstrap target root.
 * @returns Ordered checkpoint records.
 */
export function loadCheckpoints(targetDir: string): Checkpoint[] {
  const checkpointPath = join(targetDir, CHECKPOINT_DIR, CHECKPOINT_FILE);
  if (!existsSync(checkpointPath)) {
    return [];
  }

  const parsed = JSON.parse(readFileSync(checkpointPath, "utf8")) as CheckpointStore;
  return parsed.checkpoints ?? [];
}

/**
 * Appends a checkpoint to the target repository checkpoint store.
 *
 * @param targetDir - Bootstrap target root.
 * @param checkpoint - Checkpoint to persist.
 */
export function saveCheckpoint(targetDir: string, checkpoint: Checkpoint): void {
  const harnessDir = join(targetDir, CHECKPOINT_DIR);
  mkdirSync(harnessDir, { recursive: true });

  const existing = loadCheckpoints(targetDir);
  const store: CheckpointStore = { checkpoints: [...existing, checkpoint] };

  writeFileSync(join(harnessDir, CHECKPOINT_FILE), JSON.stringify(store, null, 2), "utf8");
}
