/**
 * Checkpoint and resume model for bootstrap and upgrade operations.
 */

import type { BootstrapState, UpgradePhase } from "./lifecycle.js";
import { isBootstrapState, isUpgradePhase } from "./lifecycle.js";

/** Evidence recorded at each checkpoint for idempotent resume. */
export interface CheckpointEvidence {
  inputsChecksum: string;
  outputsChecksum: string;
  resolvedDecisions?: Record<string, string>;
  safeCleanupTargets?: string[];
}

/** Recorded checkpoint tying a lifecycle state to evidence. */
export interface Checkpoint {
  state: BootstrapState | UpgradePhase;
  evidence: CheckpointEvidence;
  recordedAt: string;
}

/**
 * Records a checkpoint for the given lifecycle state.
 *
 * Side effects: none (recordedAt defaults to current time when omitted).
 *
 * @param state - Bootstrap or upgrade state at checkpoint time.
 * @param evidence - Inputs, outputs, and optional decisions/targets.
 * @param recordedAt - ISO-8601 timestamp (defaults to current time).
 * @returns Checkpoint record.
 * @throws Error when checksums are empty.
 */
export function recordCheckpoint(
  state: BootstrapState | UpgradePhase,
  evidence: CheckpointEvidence,
  recordedAt: string = new Date().toISOString(),
): Checkpoint {
  if (evidence.inputsChecksum.length === 0) {
    throw new Error("CheckpointEvidence.inputsChecksum must be non-empty");
  }
  if (evidence.outputsChecksum.length === 0) {
    throw new Error("CheckpointEvidence.outputsChecksum must be non-empty");
  }

  return { state, evidence, recordedAt };
}

/**
 * Returns the state from the last checkpoint, or null when empty.
 *
 * Side effects: none.
 *
 * @param checkpoints - Ordered checkpoint history.
 * @returns Last recorded state or null.
 */
export function getResumeState(
  checkpoints: readonly Checkpoint[],
): BootstrapState | UpgradePhase | null {
  const last = checkpoints.at(-1);
  return last?.state ?? null;
}

/**
 * Returns true when target state matches the last verified checkpoint state.
 *
 * Side effects: none.
 * Invariants: empty history allows resume only to DISCOVERED.
 *
 * @param checkpoints - Ordered checkpoint history.
 * @param targetState - Desired resume target.
 * @returns True when resume to target is consistent with history.
 */
export function canResumeFrom(
  checkpoints: readonly Checkpoint[],
  targetState: BootstrapState | UpgradePhase,
): boolean {
  const resumeState = getResumeState(checkpoints);
  if (resumeState === null) {
    return isBootstrapState(targetState) && targetState === "DISCOVERED";
  }
  return resumeState === targetState;
}
