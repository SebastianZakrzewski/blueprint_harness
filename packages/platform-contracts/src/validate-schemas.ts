import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(ROOT, "schemas", "result-envelope.v1.json");

const raw = readFileSync(schemaPath, "utf8");
const parsed: unknown = JSON.parse(raw);

if (
  typeof parsed !== "object" ||
  parsed === null ||
  (parsed as { type?: string }).type !== "object"
) {
  console.error("validate-schemas: invalid envelope schema");
  process.exit(1);
}

console.log("validate-schemas: OK");
