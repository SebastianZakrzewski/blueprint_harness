/**
 * Stable finding IDs for docs-ingestion operations.
 */

/** Duplicate content detected across multiple source files. */
export const FINDING_INGEST_DUPLICATE = "INGEST-001";

/** Mapping conflict requires human judgment before proceeding. */
export const FINDING_INGEST_CONFLICT = "INGEST-002";

/** Source manifest is missing; a proposed manifest was generated. */
export const FINDING_INGEST_MANIFEST_PROPOSED = "INGEST-003";

/** Non-canonical layout requires proposed path mappings. */
export const FINDING_INGEST_MAPPING_PROPOSED = "INGEST-004";

/** Human judgment is required before mapping authority can change. */
export const HUMAN_JUDGMENT_REQUIRED = "HUMAN_JUDGMENT_REQUIRED";
