import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { validateDocs } from "@blueprint-harness/core";
import { runCheck } from "@blueprint-harness/cli";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("blueprint regression with platform scaffold (HP1)", () => {
  it("validate-docs still passes", () => {
    expect(validateDocs(ROOT).ok).toBe(true);
  });

  it("harness check --fast still passes without Platform enabled (HP1-AC4)", () => {
    const exitCode = runCheck({ mode: "fast", rootPath: ROOT, format: "human" });
    expect(exitCode).toBe(0);
  });
});
