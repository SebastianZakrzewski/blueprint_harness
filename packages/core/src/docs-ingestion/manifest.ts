import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { InventoryEntry } from "./inventory.js";

/** One manifest entry describing source authority and intended destination. */
export interface DocsManifestEntry {
  sourcePath: string;
  authority: string;
  subject: string;
  status: string;
  canonicalDestination?: string;
}

export const MANIFEST_FILENAME = "docs-manifest.json";

/**
 * Reads an existing source manifest when present.
 *
 * @param sourcePath - Incoming docs root.
 * @returns Parsed manifest entries or undefined when absent.
 */
export function readManifest(sourcePath: string): DocsManifestEntry[] | undefined {
  const manifestPath = join(sourcePath, MANIFEST_FILENAME);
  if (!existsSync(manifestPath)) {
    return undefined;
  }

  const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    entries?: DocsManifestEntry[];
  };

  return parsed.entries ?? [];
}

/**
 * Proposes a manifest from inventory when the source has no manifest file.
 *
 * @param inventory - Inventoried source files.
 * @returns Proposed manifest entries.
 */
export function proposeManifest(inventory: InventoryEntry[]): DocsManifestEntry[] {
  return inventory
    .filter((entry) => entry.relativePath !== MANIFEST_FILENAME)
    .map((entry) => ({
      sourcePath: entry.relativePath,
      authority: "project",
      subject: inferSubject(entry.relativePath),
      status: "PROPOSED",
    }));
}

function inferSubject(relativePath: string): string {
  const lower = relativePath.toLowerCase();
  if (lower.includes("product") || lower.includes("spec")) {
    return "product-spec";
  }
  if (lower.includes("design") || lower.includes("architecture")) {
    return "design-doc";
  }
  if (lower.includes("plan")) {
    return "exec-plan";
  }
  return "unknown";
}
