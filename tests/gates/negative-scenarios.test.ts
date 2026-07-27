import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  evaluatePermissionAction,
  validateDocs,
} from "@blueprint-harness/core";
import { runArchLints } from "@blueprint-harness/profiles-typescript-node";

const FIXTURES = join(fileURLToPath(import.meta.url), "..", "..", "..", "packages", "core", "tests", "fixtures");

describe("negative scenario gates (M16b)", () => {
  it("invalid docs fail validate-docs with stable ids (M16-AC6)", () => {
    const result = validateDocs(join(FIXTURES, "execplan-invalid-root"));
    expect(result.ok).toBe(false);
    expect(result.findings.length).toBeGreaterThan(0);
  });

  it("arch violations fail arch lints (M16-AC6)", () => {
    const result = runArchLints(
      join(
        fileURLToPath(import.meta.url),
        "..",
        "..",
        "..",
        "packages",
        "profiles",
        "typescript-node",
        "tests",
        "fixtures",
        "arch-violations",
      ),
    );
    expect(result.ok).toBe(false);
    expect(result.findings.some((f) => f.id === "HARNESS-001")).toBe(true);
  });

  it("permission breach is rejected (M16-AC6)", () => {
    const result = evaluatePermissionAction("ssh_remote");
    expect(result.ok).toBe(false);
    expect(result.findings[0]?.id).toBe("PERM-001");
  });

  it("valid reference docs are not false-blocked (M16-AC6 counterexample)", () => {
    const result = validateDocs(join(FIXTURES, "docs-canonical"));
    expect(result.ok).toBe(true);
  });
});
