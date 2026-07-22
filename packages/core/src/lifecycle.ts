/**
 * Bootstrap and upgrade lifecycle states for Harness operations.
 * Bootstrap states match docs-ingestion-and-bootstrap.md (8 states).
 */

/** Bootstrap pipeline state from DISCOVERED through COMPLETE. */
export type BootstrapState =
  | "DISCOVERED"
  | "DOCS_MAPPED"
  | "DOCS_VALIDATED"
  | "HARNESS_INSTALLED"
  | "SCAFFOLD_GENERATED"
  | "VALIDATION_PASSED"
  | "PR_OPENED"
  | "COMPLETE";

/** Ordered bootstrap states matching the canonical state machine. */
export const BOOTSTRAP_STATE_ORDER: readonly BootstrapState[] = [
  "DISCOVERED",
  "DOCS_MAPPED",
  "DOCS_VALIDATED",
  "HARNESS_INSTALLED",
  "SCAFFOLD_GENERATED",
  "VALIDATION_PASSED",
  "PR_OPENED",
  "COMPLETE",
] as const;

/** Total count of bootstrap states. */
export const BOOTSTRAP_STATE_COUNT = BOOTSTRAP_STATE_ORDER.length;

/** Upgrade phase stub; full upgrade state machine is implemented in M15. */
export type UpgradePhase = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

const BOOTSTRAP_INDEX = new Map<BootstrapState, number>(
  BOOTSTRAP_STATE_ORDER.map((state, index) => [state, index]),
);

/**
 * Returns true when a bootstrap transition is valid (same state or +1 step).
 *
 * Side effects: none.
 * Invariants: only forward-by-one or idempotent transitions are valid.
 *
 * @param from - Current bootstrap state.
 * @param to - Target bootstrap state.
 * @returns True for idempotent same-state or the next sequential state.
 */
export function isValidBootstrapTransition(
  from: BootstrapState,
  to: BootstrapState,
): boolean {
  const fromIndex = BOOTSTRAP_INDEX.get(from);
  const toIndex = BOOTSTRAP_INDEX.get(to);
  if (fromIndex === undefined || toIndex === undefined) {
    return false;
  }
  return toIndex === fromIndex || toIndex === fromIndex + 1;
}

/**
 * Parses an unknown value into a BootstrapState.
 *
 * Side effects: none.
 *
 * @param value - Candidate bootstrap state.
 * @returns True when value is a known BootstrapState.
 */
export function isBootstrapState(value: unknown): value is BootstrapState {
  return (
    typeof value === "string" &&
    BOOTSTRAP_INDEX.has(value as BootstrapState)
  );
}

/**
 * Parses an unknown value into an UpgradePhase.
 *
 * Side effects: none.
 *
 * @param value - Candidate upgrade phase.
 * @returns True when value is a known UpgradePhase.
 */
export function isUpgradePhase(value: unknown): value is UpgradePhase {
  return (
    value === "PLANNED" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED" ||
    value === "FAILED"
  );
}
