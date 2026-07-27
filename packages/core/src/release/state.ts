/** Canonical release lifecycle states from release-and-autonomy doc. */
export type ReleaseState =
  | "CREATED"
  | "STAGING_DEPLOYED"
  | "STAGING_VERIFIED"
  | "PRODUCTION_READY"
  | "CANARY"
  | "OBSERVING"
  | "ROLLING_OUT"
  | "PRODUCTION_VERIFIED"
  | "ROLLOUT_PAUSED"
  | "ROLLBACK_RUNNING"
  | "ROLLED_BACK"
  | "RELEASE_FAILED"
  | "HUMAN_JUDGMENT_REQUIRED";

export const RELEASE_STATE_ORDER: readonly ReleaseState[] = [
  "CREATED",
  "STAGING_DEPLOYED",
  "STAGING_VERIFIED",
  "PRODUCTION_READY",
  "CANARY",
  "OBSERVING",
  "ROLLING_OUT",
  "PRODUCTION_VERIFIED",
] as const;

/**
 * Returns true when a release state transition is valid (same or forward one step).
 *
 * @param from - Current release state.
 * @param to - Target release state.
 */
export function isValidReleaseTransition(from: ReleaseState, to: ReleaseState): boolean {
  if (from === to) {
    return true;
  }

  const exceptional: ReleaseState[] = [
    "ROLLOUT_PAUSED",
    "ROLLBACK_RUNNING",
    "ROLLED_BACK",
    "RELEASE_FAILED",
    "HUMAN_JUDGMENT_REQUIRED",
  ];

  if (exceptional.includes(to)) {
    return true;
  }

  const fromIndex = RELEASE_STATE_ORDER.indexOf(from as typeof RELEASE_STATE_ORDER[number]);
  const toIndex = RELEASE_STATE_ORDER.indexOf(to as typeof RELEASE_STATE_ORDER[number]);
  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }

  return toIndex === fromIndex + 1;
}
