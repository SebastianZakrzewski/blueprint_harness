/**
 * Stable finding IDs for profile-sdk capability resolution.
 * Separate namespace from Core docs finding IDs (EXEC-*, LAYOUT-*, etc.).
 */

/** Two or more selected capabilities are mutually incompatible. */
export const FINDING_CAPABILITY_INCOMPATIBLE = "CAPABILITY-001";

/** A selected capability is missing a required dependency. */
export const FINDING_CAPABILITY_MISSING_DEPENDENCY = "CAPABILITY-002";

/** A requested capability id is not registered in the catalog. */
export const FINDING_CAPABILITY_UNKNOWN = "CAPABILITY-003";
