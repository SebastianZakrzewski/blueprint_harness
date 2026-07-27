/**
 * Docs validation finding IDs.
 *
 * Separate namespace from Universal Invariant catalogue (ARCH-001, DOC-001, etc.
 * in architecture-enforcement.md). Validation findings use EXEC/LAYOUT/STATUS/LINK
 * prefixes to avoid collision with invariant IDs.
 */

/** Missing required ExecPlan section heading (## level). */
export const FINDING_EXEC_MISSING_HEADING = "EXEC-001";

/** Missing required knowledge layout file or directory. */
export const FINDING_LAYOUT_MISSING_PATH = "LAYOUT-002";

/** Missing or invalid Status header in a required document. */
export const FINDING_STATUS_MISSING = "STATUS-003";

/** Broken relative markdown link in a docs index file. */
export const FINDING_LINK_BROKEN = "LINK-004";
