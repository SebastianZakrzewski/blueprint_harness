import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runStructuralHarnessChecks } from "../src/structural/harness-files.js";
import { runStructuralImportGraph } from "../src/structural/import-graph.js";

const FIXTURES = join(fileURLToPath(import.meta.url), "..", "fixtures");

describe("structural harness checks (M11)", () => {
  it("flags TEST-001 when server.ts lacks server.test.ts (M11-AC1 negative)", () => {
    const missingTest = join(FIXTURES, "structural-missing-test");
    const result = runStructuralHarnessChecks(missingTest);
    expect(result.ok).toBe(false);
    expect(result.findings[0]?.id).toBe("TEST-001");
    expect(result.findings[0]?.remediation).toBeTruthy();
  });

  it("passes when server.test.ts exists (M11-AC1 positive)", () => {
    const valid = join(FIXTURES, "structural-valid-test");
    const result = runStructuralHarnessChecks(valid);
    expect(result.ok).toBe(true);
  });
});

describe("structural import graph (M11)", () => {
  it("flags ARCH-003 on import cycle (M11-AC1 negative)", () => {
    const result = runStructuralImportGraph(join(FIXTURES, "cycle-violations"));
    expect(result.ok).toBe(false);
    expect(result.findings[0]?.id).toBe("ARCH-003");
  });

  it("passes acyclic graph (M11-AC5)", () => {
    const result = runStructuralImportGraph(join(FIXTURES, "arch-valid"));
    expect(result.ok).toBe(true);
  });
});
