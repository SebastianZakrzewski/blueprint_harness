import { describe, expect, it } from "vitest";

import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { runArchLints } from "../../src/lint/arch-lints.js";

const FIXTURES = join(fileURLToPath(import.meta.url), "..", "fixtures");

describe("arch lints (M11)", () => {
  it("passes valid fixture without false positives (M11-AC5)", () => {
    const result = runArchLints(join(FIXTURES, "arch-valid"));
    expect(result.ok).toBe(true);
  });

  it("flags HARNESS-001 CI bypass attempt (M11-AC4)", () => {
    const result = runArchLints(join(FIXTURES, "arch-violations"));
    expect(result.ok).toBe(false);
    expect(result.findings.some((f) => f.id === "HARNESS-001")).toBe(true);
    expect(result.findings[0]?.remediation).toBeTruthy();
  });
});
