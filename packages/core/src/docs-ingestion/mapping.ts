import type { InventoryEntry } from "./inventory.js";

/** Proposed source-to-canonical path mapping. */
export interface ProposedMapping {
  sourcePath: string;
  targetPath: string;
  reason: string;
  requiresHumanApproval: boolean;
}

function classifyTargetPath(relativePath: string): string {
  const lower = relativePath.toLowerCase();
  const basename = relativePath.split("/").pop() ?? relativePath;

  if (lower.startsWith("docs/")) {
    return relativePath;
  }

  if (lower.includes("product") || lower.includes("spec")) {
    return `docs/product-specs/${basename}`;
  }

  if (lower.includes("design") || lower.includes("architecture")) {
    return `docs/design-docs/${basename}`;
  }

  if (lower.includes("plan")) {
    return `docs/exec-plans/active/${basename}`;
  }

  if (basename === "AGENTS.md" || basename === "ARCHITECTURE.md") {
    return basename;
  }

  return `docs/references/${basename}`;
}

/**
 * Proposes canonical destination paths for non-canonical incoming docs.
 *
 * @param inventory - Inventoried source files.
 * @returns Proposed mappings with human-approval flags when authority may change.
 */
export function proposeMappings(inventory: InventoryEntry[]): ProposedMapping[] {
  return inventory
    .filter((entry) => entry.relativePath !== "docs-manifest.json")
    .map((entry) => {
      const targetPath = classifyTargetPath(entry.relativePath);
      const authorityChange =
        entry.relativePath !== targetPath && !entry.relativePath.startsWith("docs/");

      return {
        sourcePath: entry.relativePath,
        targetPath,
        reason: authorityChange
          ? "Non-canonical path requires semantic mapping to harness layout."
          : "Canonical-relative path retained.",
        requiresHumanApproval: authorityChange,
      };
    });
}

/**
 * Detects mapping conflicts where multiple sources target the same canonical path
 * with incompatible authority implications.
 *
 * @param mappings - Proposed mappings to inspect.
 * @returns Conflict mappings requiring human judgment.
 */
export function detectMappingConflicts(mappings: ProposedMapping[]): ProposedMapping[] {
  const byTarget = new Map<string, ProposedMapping[]>();

  for (const mapping of mappings) {
    const group = byTarget.get(mapping.targetPath) ?? [];
    group.push(mapping);
    byTarget.set(mapping.targetPath, group);
  }

  const conflicts: ProposedMapping[] = [];

  for (const group of byTarget.values()) {
    if (group.length > 1) {
      conflicts.push(...group);
    }
  }

  return conflicts;
}
