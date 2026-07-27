import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { FINDING_EXEC_MISSING_HEADING } from "../src/docs-finding-ids.js";
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

  it("reports EXEC-001 for missing top-level headings in negative fixture", () => {
    const fixturePath = join(FIXTURES_DIR, "execplan-invalid/missing-heading.md");
    const content = readFileSync(fixturePath, "utf8");
    const findings = lintExecPlanFile(
      "docs/exec-plans/active/missing-heading.md",
      content,
    );

    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.id === FINDING_EXEC_MISSING_HEADING)).toBe(true);
    expect(findings.some((f) => f.message.includes("Surprises & Discoveries"))).toBe(
      true,
    );
  });

  it("does not treat nested ### headings as top-level sections", () => {
    const content = `
# Plan

Status: ACTIVE

## Purpose / Big Picture

Outcome.

### Progress

Nested only.

## Surprises & Discoveries

None.
`;

    const findings = lintExecPlanFile("docs/exec-plans/active/nested.md", content);
    expect(findings.some((f) => f.message.includes("Progress"))).toBe(true);
    expect(findings.every((f) => f.id === FINDING_EXEC_MISSING_HEADING)).toBe(true);
  });

  it("lintExecPlans passes on canonical Blueprint repo", () => {
    const findings = lintExecPlans(REPO_ROOT);
    expect(findings).toHaveLength(0);
  });
});
