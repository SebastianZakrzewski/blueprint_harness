import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

/**
 * Reads and parses a JSON fixture from the tests/fixtures directory.
 *
 * @param name - Fixture filename.
 * @returns Parsed JSON value.
 */
export function readFixture<T>(name: string): T {
  const raw = readFileSync(join(FIXTURES_DIR, name), "utf8");
  return JSON.parse(raw) as T;
}
