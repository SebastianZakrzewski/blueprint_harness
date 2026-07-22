/**
 * File ownership classes for Blueprint-managed repositories.
 */

/** Ownership class determining upgrade and overwrite behavior. */
export type FileOwnershipClass =
  | "BLUEPRINT_MANAGED"
  | "PROJECT_OWNED"
  | "MERGE_CONTROLLED"
  | "GENERATED";

/** Metadata describing a file's ownership class and optional checksum. */
export interface FileOwnershipMetadata {
  path: string;
  class: FileOwnershipClass;
  checksum?: string;
}

const OWNERSHIP_CLASSES: ReadonlySet<string> = new Set([
  "BLUEPRINT_MANAGED",
  "PROJECT_OWNED",
  "MERGE_CONTROLLED",
  "GENERATED",
]);

/**
 * Parses an unknown value into a FileOwnershipClass.
 *
 * Side effects: none.
 *
 * @param value - Candidate ownership class.
 * @returns True when value is a known FileOwnershipClass.
 */
export function isFileOwnershipClass(
  value: unknown,
): value is FileOwnershipClass {
  return typeof value === "string" && OWNERSHIP_CLASSES.has(value);
}

/**
 * Creates validated file ownership metadata.
 *
 * Side effects: none.
 * Invariants: path must be non-empty; class must be a known FileOwnershipClass.
 *
 * @param metadata - Path, class, and optional checksum.
 * @returns Typed FileOwnershipMetadata.
 * @throws Error when path is empty or class is invalid.
 */
export function createFileOwnershipMetadata(
  metadata: FileOwnershipMetadata,
): FileOwnershipMetadata {
  if (metadata.path.length === 0) {
    throw new Error("FileOwnershipMetadata.path must be non-empty");
  }
  if (!isFileOwnershipClass(metadata.class)) {
    throw new Error(`Invalid FileOwnershipClass: ${String(metadata.class)}`);
  }
  return metadata;
}
