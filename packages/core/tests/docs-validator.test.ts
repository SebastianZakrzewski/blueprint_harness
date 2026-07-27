import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  FINDING_LAYOUT_MISSING_PATH,
  FINDING_LINK_BROKEN,
  FINDING_STATUS_MISSING,
} from "../src/docs-finding-ids.js";
import { validateDocsStructure } from "../src/docs-validator.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const REPO_ROOT = join(FIXTURES_DIR, "../../../..");
const DOCS_INVALID = join(FIXTURES_DIR, "docs-invalid");
const STATUS_INVALID = join(FIXTURES_DIR, "status-invalid");
const LINK_INVALID = join(FIXTURES_DIR, "link-invalid");

describe("docs-validator", () => {
  it("passes canonical Blueprint docs structure", () => {
    const findings = validateDocsStructure(REPO_ROOT);

    expect(findings).toHaveLength(0);
  });

  it("reports LAYOUT-002 for missing knowledge layout paths", () => {
    const findings = validateDocsStructure(DOCS_INVALID);

    expect(findings.some((f) => f.id === FINDING_LAYOUT_MISSING_PATH)).toBe(true);
    expect(findings.some((f) => f.severity === "error")).toBe(true);
  });

  it("reports STATUS-003 for missing Status header", () => {
    const findings = validateDocsStructure(STATUS_INVALID);

    expect(findings.some((f) => f.id === FINDING_STATUS_MISSING)).toBe(true);
    expect(findings.some((f) => f.path === "ARCHITECTURE.md")).toBe(true);
  });

  it("reports LINK-004 for broken index link", () => {
    const findings = validateDocsStructure(LINK_INVALID);

    expect(findings.some((f) => f.id === FINDING_LINK_BROKEN)).toBe(true);
    expect(
      findings.some((f) => f.path === "docs/product-specs/index.md"),
    ).toBe(true);
  });
});
