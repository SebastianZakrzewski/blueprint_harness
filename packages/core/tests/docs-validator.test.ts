import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { validateDocsStructure } from "../src/docs-validator.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const REPO_ROOT = join(FIXTURES_DIR, "../../../..");
const DOCS_INVALID = join(FIXTURES_DIR, "docs-invalid");

describe("docs-validator", () => {
  it("passes canonical Blueprint docs structure", () => {
    const findings = validateDocsStructure(REPO_ROOT);

    expect(findings).toHaveLength(0);
  });

  it("reports DOC-002 for missing knowledge layout paths", () => {
    const findings = validateDocsStructure(DOCS_INVALID);

    expect(findings.some((f) => f.id === "DOC-002")).toBe(true);
    expect(findings.some((f) => f.severity === "error")).toBe(true);
  });
});
