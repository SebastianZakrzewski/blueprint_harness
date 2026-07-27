import { buildValidationResult, type ValidationResult } from "../validation-result.js";
import { getMonitoringStatus } from "./monitoring.js";

/** Rollout control states from release-and-autonomy doc. */
export type RolloutControlState = "ACTIVE" | "ROLLOUT_PAUSED" | "AUTONOMY_FROZEN";

let rolloutState: RolloutControlState = "ACTIVE";

/**
 * Returns current rollout control state.
 */
export function getRolloutControlState(): RolloutControlState {
  return rolloutState;
}

/**
 * Pauses rollout expansion per recovery policy.
 */
export function pauseRollout(): void {
  rolloutState = "ROLLOUT_PAUSED";
}

/**
 * Freezes autonomy after rollback failure or monitoring outage.
 */
export function freezeAutonomy(): void {
  rolloutState = "AUTONOMY_FROZEN";
}

/**
 * Resets rollout control state for tests.
 */
export function resetRolloutControl(): void {
  rolloutState = "ACTIVE";
}

/**
 * Evaluates whether production autonomy actions are blocked.
 */
export function isProductionAutonomyBlocked(): boolean {
  return getMonitoringStatus() === "UNAVAILABLE" || rolloutState === "AUTONOMY_FROZEN";
}

/**
 * Applies monitoring-unavailable freeze policy.
 */
export function applyMonitoringUnavailableFreeze(): ValidationResult {
  freezeAutonomy();
  return buildValidationResult([
    {
      id: "RECOVERY-001",
      severity: "error",
      message: "MONITORING_STATUS: UNAVAILABLE blocks production autonomy and freezes autonomy.",
    },
  ]);
}
