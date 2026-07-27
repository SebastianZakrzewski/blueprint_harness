import { buildValidationResult, type Finding } from "../validation-result.js";
import { isCanonicalDocsLayout } from "./canonical.js";
import {
  FINDING_INGEST_CONFLICT,
  FINDING_INGEST_DUPLICATE,
  FINDING_INGEST_MANIFEST_PROPOSED,
  FINDING_INGEST_MAPPING_PROPOSED,
  HUMAN_JUDGMENT_REQUIRED,
} from "./finding-ids.js";
import { inventoryDocsSync, type InventoryEntry } from "./inventory.js";
import { proposeManifest, readManifest, type DocsManifestEntry } from "./manifest.js";
import { detectMappingConflicts, proposeMappings, type ProposedMapping } from "./mapping.js";

/** Outcome of docs ingestion analysis before bootstrap mutation. */
export interface DocsIngestionResult {
  canonical: boolean;
  manifestPresent: boolean;
  manifestProposed: boolean;
  mappingProposed: boolean;
  humanJudgmentRequired: boolean;
  inventory: InventoryEntry[];
  proposedManifest?: DocsManifestEntry[];
  proposedMappings?: ProposedMapping[];
  findings: Finding[];
}

/**
 * Detects duplicate content via matching checksums in inventory.
 *
 * @param inventory - Inventoried source files.
 * @returns Findings with stable INGEST-001 IDs.
 */
export function detectDuplicateContent(inventory: InventoryEntry[]): Finding[] {
  const byChecksum = new Map<string, InventoryEntry[]>();

  for (const entry of inventory) {
    if (entry.sizeBytes === 0 || entry.relativePath.endsWith(".gitkeep")) {
      continue;
    }

    const group = byChecksum.get(entry.checksum) ?? [];
    group.push(entry);
    byChecksum.set(entry.checksum, group);
  }

  const findings: Finding[] = [];

  for (const group of byChecksum.values()) {
    if (group.length > 1) {
      findings.push({
        id: FINDING_INGEST_DUPLICATE,
        severity: "error",
        message: `Duplicate content detected across: ${group.map((e) => e.relativePath).join(", ")}`,
        remediation: "Remove or reconcile duplicate source files before import.",
      });
    }
  }

  return findings;
}

/**
 * Analyzes incoming docs: inventory, manifest, canonical detection, mapping, conflicts.
 *
 * @param sourcePath - Incoming docs root directory.
 * @returns Structured ingestion result with findings and proposed artifacts.
 */
export function ingestDocs(sourcePath: string): DocsIngestionResult {
  const inventory = inventoryDocsSync(sourcePath);
  const findings: Finding[] = [...detectDuplicateContent(inventory)];

  const existingManifest = readManifest(sourcePath);
  const manifestPresent = existingManifest !== undefined;
  let proposedManifest: DocsManifestEntry[] | undefined;
  let manifestProposed = false;

  if (!manifestPresent) {
    proposedManifest = proposeManifest(inventory);
    manifestProposed = true;
    findings.push({
      id: FINDING_INGEST_MANIFEST_PROPOSED,
      severity: "info",
      message: "Source manifest absent; proposed docs-manifest.json generated.",
    });
  }

  const canonical = isCanonicalDocsLayout(sourcePath);
  let proposedMappings: ProposedMapping[] | undefined;
  let mappingProposed = false;
  let humanJudgmentRequired = false;

  if (!canonical) {
    proposedMappings = proposeMappings(inventory);
    mappingProposed = true;
    findings.push({
      id: FINDING_INGEST_MAPPING_PROPOSED,
      severity: "info",
      message: "Non-canonical layout detected; proposed mapping artifact generated.",
    });

    const conflicts = detectMappingConflicts(proposedMappings);
    if (conflicts.length > 0) {
      humanJudgmentRequired = true;
      findings.push({
        id: FINDING_INGEST_CONFLICT,
        severity: "error",
        message: HUMAN_JUDGMENT_REQUIRED,
        remediation:
          "Resolve conflicting mappings targeting the same canonical path before import.",
      });
    }

    if (proposedMappings.some((mapping) => mapping.requiresHumanApproval)) {
      humanJudgmentRequired = true;
    }
  }

  return {
    canonical,
    manifestPresent,
    manifestProposed,
    mappingProposed,
    humanJudgmentRequired,
    inventory,
    proposedManifest,
    proposedMappings,
    findings,
  };
}

/**
 * Validates ingestion outcome using PLAN-005 Model A semantics.
 *
 * @param result - Docs ingestion analysis result.
 * @returns Validation result for CLI and bootstrap gates.
 */
export function validateIngestionResult(result: DocsIngestionResult) {
  return buildValidationResult(result.findings);
}
