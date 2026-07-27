import { existsSync } from "node:fs";
import { join } from "node:path";

/** Required files for canonical harness knowledge layout (incoming docs root). */
const REQUIRED_CANONICAL_FILES: readonly string[] = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "docs/exec-plans/tech-debt-tracker.md",
  "docs/generated/db-schema.md",
  "docs/DESIGN.md",
  "docs/FRONTEND.md",
  "docs/PLANS.md",
  "docs/PRODUCT_SENSE.md",
  "docs/QUALITY_SCORE.md",
  "docs/RELIABILITY.md",
  "docs/SECURITY.md",
];

/** Required directories for canonical harness knowledge layout. */
const REQUIRED_CANONICAL_DIRS: readonly string[] = [
  "docs/design-docs",
  "docs/exec-plans/active",
  "docs/exec-plans/completed",
  "docs/product-specs",
  "docs/references",
];

/**
 * Returns true when incoming docs already match the harness knowledge layout.
 *
 * @param sourcePath - Incoming docs root.
 * @returns True when all required paths exist under sourcePath.
 */
export function isCanonicalDocsLayout(sourcePath: string): boolean {
  for (const relativePath of REQUIRED_CANONICAL_FILES) {
    if (!existsSync(join(sourcePath, relativePath))) {
      return false;
    }
  }

  for (const relativePath of REQUIRED_CANONICAL_DIRS) {
    if (!existsSync(join(sourcePath, relativePath))) {
      return false;
    }
  }

  return true;
}
