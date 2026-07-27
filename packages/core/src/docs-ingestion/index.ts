export {
  FINDING_INGEST_CONFLICT,
  FINDING_INGEST_DUPLICATE,
  FINDING_INGEST_MANIFEST_PROPOSED,
  FINDING_INGEST_MAPPING_PROPOSED,
  HUMAN_JUDGMENT_REQUIRED,
} from "./finding-ids.js";

export { isCanonicalDocsLayout } from "./canonical.js";

export {
  inventoryDocs,
  inventoryDocsSync,
  type InventoryEntry,
} from "./inventory.js";

export {
  MANIFEST_FILENAME,
  proposeManifest,
  readManifest,
  type DocsManifestEntry,
} from "./manifest.js";

export {
  detectMappingConflicts,
  proposeMappings,
  type ProposedMapping,
} from "./mapping.js";

export {
  detectDuplicateContent,
  ingestDocs,
  validateIngestionResult,
  type DocsIngestionResult,
} from "./validate.js";
