import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { FINDING_EXEC_MISSING_HEADING, FINDING_LAYOUT_MISSING_PATH } from "../src/docs-finding-ids.js";
import {
  hasBlockingFindings,
  serializeValidationResult,
} from "../src/validation-result.js";
import { resolveRepoRoot, validateDocs } from "../src/validate-docs.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const REPO_ROOT = join(FIXTURES_DIR, "../../../..");
const DOCS_INVALID = join(FIXTURES_DIR, "docs-invalid");
const EXECPLAN_INVALID_ROOT = join(FIXTURES_DIR, "execplan-invalid-root");

describe("validate-docs", () => {
  it("resolveRepoRoot finds monorepo from packages/core", () => {
    const coreDir = join(REPO_ROOT, "packages/core");
    expect(resolveRepoRoot(coreDir)).toBe(REPO_ROOT);
  });

  it("validateDocs passes on canonical Blueprint docs (M2-AC1)", () => {
    const result = validateDocs(REPO_ROOT);

    expect(result.ok).toBe(true);
    expect(hasBlockingFindings(result)).toBe(false);
    expect(result.findings).toHaveLength(0);
  });

  it("validateDocs fails on docs-invalid fixture with blocking findings", () => {
    const result = validateDocs(DOCS_INVALID);

    expect(result.ok).toBe(false);
    expect(hasBlockingFindings(result)).toBe(true);
  });

  it("validateDocs fails with EXEC-001 on execplan-invalid-root (M2-AC2)", () => {
    const result = validateDocs(EXECPLAN_INVALID_ROOT);

    expect(result.ok).toBe(false);
    expect(hasBlockingFindings(result)).toBe(true);
    expect(result.findings.some((f) => f.id === FINDING_EXEC_MISSING_HEADING)).toBe(
      true,
    );
  });

  it("JSON output includes findings with id, severity, path, message (M2-AC3)", () => {
    const result = validateDocs(DOCS_INVALID);
    const parsed = JSON.parse(serializeValidationResult(result)) as {
      findings: Array<{
        id: string;
        severity: string;
        path?: string;
        message: string;
      }>;
    };

    expect(parsed.findings.length).toBeGreaterThan(0);
    for (const finding of parsed.findings) {
      expect(finding.id).toBeTruthy();
      expect(finding.severity).toBeTruthy();
      expect(finding.path).toBeTruthy();
      expect(finding.message).toBeTruthy();
    }
    expect(parsed.findings.some((f) => f.id === FINDING_LAYOUT_MISSING_PATH)).toBe(
      true,
    );
  });
});
