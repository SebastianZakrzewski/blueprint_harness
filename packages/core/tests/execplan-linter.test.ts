import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  lintExecPlanFile,
  lintExecPlans,
  REQUIRED_EXECPLAN_HEADINGS,
} from "../src/execplan-linter.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const REPO_ROOT = join(FIXTURES_DIR, "../../../..");

describe("execplan-linter", () => {
  it("passes canonical ExecPlan with all 12 required headings", () => {
    const execPlanPath = join(
      REPO_ROOT,
      "docs/exec-plans/active/build-harness-blueprint-v1.md",
    );
    const content = readFileSync(execPlanPath, "utf8");
    const findings = lintExecPlanFile(
      "docs/exec-plans/active/build-harness-blueprint-v1.md",
      content,
    );

    expect(findings).toHaveLength(0);
    expect(REQUIRED_EXECPLAN_HEADINGS).toHaveLength(12);
  });

  it("reports DOC-001 for missing headings in negative fixture", () => {
    const fixturePath = join(FIXTURES_DIR, "execplan-invalid/missing-heading.md");
    const content = readFileSync(fixturePath, "utf8");
    const findings = lintExecPlanFile(
      "docs/exec-plans/active/missing-heading.md",
      content,
    );

    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.id === "DOC-001")).toBe(true);
    expect(findings.some((f) => f.message.includes("Surprises & Discoveries"))).toBe(
      true,
    );
  });

  it("lintExecPlans passes on canonical Blueprint repo", () => {
    const findings = lintExecPlans(REPO_ROOT);
    expect(findings).toHaveLength(0);
  });
});
