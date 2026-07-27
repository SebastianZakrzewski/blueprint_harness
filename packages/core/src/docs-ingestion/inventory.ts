import { createHash } from "node:crypto";
import { createReadStream, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** One inventoried file with checksum metadata. */
export interface InventoryEntry {
  relativePath: string;
  checksum: string;
  sizeBytes: number;
}

function toPosix(path: string): string {
  return path.replace(/\\/g, "/");
}

async function checksumFile(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

function walkFiles(dir: string, root: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, root, out);
    } else if (entry.isFile()) {
      out.push(toPosix(relative(root, fullPath)));
    }
  }
}

/**
 * Inventories every file under a source docs path with SHA-256 checksums.
 *
 * @param sourcePath - Root directory containing incoming docs.
 * @returns Sorted inventory entries.
 */
export async function inventoryDocs(sourcePath: string): Promise<InventoryEntry[]> {
  const files: string[] = [];
  walkFiles(sourcePath, sourcePath, files);

  const inventory: InventoryEntry[] = [];

  for (const relativePath of files.sort()) {
    const fullPath = join(sourcePath, relativePath);
    const sizeBytes = statSync(fullPath).size;
    const checksum = await checksumFile(fullPath);
    inventory.push({ relativePath, checksum, sizeBytes });
  }

  return inventory;
}

/**
 * Synchronous inventory for tests and small fixtures.
 *
 * @param sourcePath - Root directory containing incoming docs.
 * @returns Sorted inventory entries.
 */
export function inventoryDocsSync(sourcePath: string): InventoryEntry[] {
  const files: string[] = [];
  walkFiles(sourcePath, sourcePath, files);

  return files.sort().map((relativePath) => {
    const fullPath = join(sourcePath, relativePath);
    const data = readFileSync(fullPath);
    const checksum = createHash("sha256").update(data).digest("hex");
    return {
      relativePath,
      checksum,
      sizeBytes: data.length,
    };
  });
}
