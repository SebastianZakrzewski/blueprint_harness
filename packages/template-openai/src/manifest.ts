import { createFileOwnershipMetadata, type FileOwnershipMetadata } from "@blueprint-harness/core";

import { CURSOR_ADAPTER_ENTRIES } from "./cursor-adapter.js";
import { GITHUB_CI_ENTRIES } from "./github-ci.js";
import type { ManifestEntry } from "./types.js";

/**
 * Knowledge layout paths from docs/product-specs/harness-blueprint.md.
 * M3 excludes BACKEND.md and separate plan template files (M3-AC5).
 */
export const KNOWLEDGE_LAYOUT_ENTRIES: readonly ManifestEntry[] = [
  { path: "AGENTS.md", kind: "file", ownershipClass: "MERGE_CONTROLLED", templatePath: "AGENTS.md" },
  {
    path: "ARCHITECTURE.md",
    kind: "file",
    ownershipClass: "MERGE_CONTROLLED",
    templatePath: "ARCHITECTURE.md",
  },
  { path: "docs/design-docs", kind: "directory", ownershipClass: "PROJECT_OWNED" },
  { path: "docs/exec-plans/active", kind: "directory", ownershipClass: "PROJECT_OWNED" },
  { path: "docs/exec-plans/completed", kind: "directory", ownershipClass: "PROJECT_OWNED" },
  {
    path: "docs/exec-plans/tech-debt-tracker.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/exec-plans/tech-debt-tracker.md",
  },
  {
    path: "docs/generated/db-schema.md",
    kind: "file",
    ownershipClass: "GENERATED",
    templatePath: "docs/generated/db-schema.md",
  },
  { path: "docs/product-specs", kind: "directory", ownershipClass: "PROJECT_OWNED" },
  { path: "docs/references", kind: "directory", ownershipClass: "PROJECT_OWNED" },
  {
    path: "docs/DESIGN.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/DESIGN.md",
  },
  {
    path: "docs/FRONTEND.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/FRONTEND.md",
  },
  {
    path: "docs/PLANS.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/PLANS.md",
  },
  {
    path: "docs/PRODUCT_SENSE.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/PRODUCT_SENSE.md",
  },
  {
    path: "docs/QUALITY_SCORE.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/QUALITY_SCORE.md",
  },
  {
    path: "docs/RELIABILITY.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/RELIABILITY.md",
  },
  {
    path: "docs/SECURITY.md",
    kind: "file",
    ownershipClass: "PROJECT_OWNED",
    templatePath: "docs/SECURITY.md",
  },
];

/** Layout paths as listed in harness-blueprint (files and trailing-slash directories). */
export const KNOWLEDGE_LAYOUT_PATHS: readonly string[] = KNOWLEDGE_LAYOUT_ENTRIES.map(
  (entry) => (entry.kind === "directory" ? `${entry.path}/` : entry.path),
);

/**
 * Returns ownership metadata for every templated file in the knowledge layout.
 *
 * @returns File ownership records for manifest file entries.
 */
export function getFileOwnershipManifest(): FileOwnershipMetadata[] {
  return [...KNOWLEDGE_LAYOUT_ENTRIES, ...CURSOR_ADAPTER_ENTRIES, ...GITHUB_CI_ENTRIES]
    .filter((entry) => entry.kind === "file")
    .map((entry) =>
      createFileOwnershipMetadata({
        path: entry.path,
        class: entry.ownershipClass,
      }),
    );
}

/**
 * Returns the full knowledge layout manifest entries.
 *
 * @returns All file and directory manifest entries.
 */
export function getKnowledgeLayoutManifest(): readonly ManifestEntry[] {
  return KNOWLEDGE_LAYOUT_ENTRIES;
}
