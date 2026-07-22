/**
 * Universal invariant identifiers from architecture-enforcement.md.
 * Profiles translate these stable IDs into stack-specific checks.
 */

/** A stable invariant identifier from the Universal catalogue. */
export type InvariantId =
  | "ARCH-001"
  | "ARCH-002"
  | "ARCH-003"
  | "BOUNDARY-001"
  | "CONFIG-001"
  | "LOG-001"
  | "LOG-002"
  | "NAME-001"
  | "DOC-001"
  | "SIZE-001"
  | "ERROR-001"
  | "SIDEFX-001"
  | "TEST-001"
  | "RELIABILITY-001"
  | "RELIABILITY-002"
  | "ABSTRACTION-001"
  | "CLEAN-001"
  | "HARNESS-001";

/** Human-readable intent for each invariant ID. */
export type InvariantCatalog = Readonly<Record<InvariantId, string>>;

/** Canonical invariant catalogue matching architecture-enforcement.md. */
export const INVARIANT_CATALOG: InvariantCatalog = {
  "ARCH-001": "Layer dependencies follow the approved direction",
  "ARCH-002": "Cross-domain access uses a public boundary",
  "ARCH-003": "The dependency graph contains no prohibited cycle",
  "BOUNDARY-001": "External values are parsed and validated",
  "CONFIG-001": "Configuration is parsed, typed, and centralized",
  "LOG-001": "Operational logs are structured",
  "LOG-002": "Logs carry required correlation context and redact sensitive data",
  "NAME-001": "Names expose intent, type, identity, and units",
  "DOC-001": "Named production functions carry required contract documentation",
  "SIZE-001": "Files and modules remain within profile-defined legibility bounds",
  "ERROR-001": "Error semantics are explicit and consistent",
  "SIDEFX-001": "Side effects occur at visible, controlled boundaries",
  "TEST-001": "Meaningful behavior changes have regression protection",
  "RELIABILITY-001": "Required timeout, retry, and idempotency rules are present",
  "RELIABILITY-002": "Critical operations expose required health and telemetry",
  "ABSTRACTION-001": "Shared abstractions solve evidenced repeated behavior or coupling",
  "CLEAN-001": "Dead, duplicated, or expired exception paths do not accumulate",
  "HARNESS-001": "Agents cannot bypass, weaken, or self-modify required controls",
} as const;

/** Canonical list of invariant IDs in catalogue definition order. */
export const INVARIANT_IDS: readonly InvariantId[] = Object.keys(
  INVARIANT_CATALOG,
) as InvariantId[];

/** Total count of universal invariants. */
export const INVARIANT_COUNT = INVARIANT_IDS.length;

const INVARIANT_ID_SET = new Set<string>(INVARIANT_IDS);

/**
 * Parses an unknown value into an InvariantId.
 *
 * Side effects: none.
 * Invariants: returns true only for IDs present in INVARIANT_CATALOG.
 *
 * @param value - Candidate invariant identifier.
 * @returns True when value is a known InvariantId.
 */
export function isInvariantId(value: unknown): value is InvariantId {
  return typeof value === "string" && INVARIANT_ID_SET.has(value);
}
