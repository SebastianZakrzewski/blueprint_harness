import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { resolveRepoRoot, validateDocs } from "@blueprint-harness/core";

import {
  CHECK_PROVIDER_NAMES,
  buildInspectResult,
  cliVersion,
  runCheck,
  runValidateDocs,
} from "../src/index.js";

const REPO_ROOT = resolveRepoRoot(join(fileURLToPath(import.meta.url), "..", "..", ".."));

describe("harness CLI (M6)", () => {
  it("prints semver from package.json (M6-AC1)", () => {
    expect(cliVersion).toBe("0.0.0");
  });

  it("validate-docs matches Core findings on canonical repo (M6-AC2)", () => {
    const coreResult = validateDocs(REPO_ROOT);
    const exitCode = runValidateDocs({ rootPath: REPO_ROOT, format: "json" });

    expect(exitCode).toBe(coreResult.ok ? 0 : 1);
  });

  it("inspect JSON includes blueprintVersion and packages (M6-AC3)", () => {
    const inspect = buildInspectResult(REPO_ROOT);

    expect(inspect.blueprintVersion).toBe("0.0.0");
    expect(inspect.packages.length).toBeGreaterThan(0);
    expect(inspect.packages.some((pkg) => pkg.name === "@blueprint-harness/core")).toBe(true);
  });

  it("check --fast exits 0 on clean repo (M6-AC4)", () => {
    const exitCode = runCheck({ mode: "fast", rootPath: REPO_ROOT, format: "human" });
    expect(exitCode).toBe(0);
  });

  it("injected failure exits non-zero with invariant id (M6-AC5)", () => {
    process.env.HARNESS_CHECK_INJECT = "ARCH-001";
    const exitCode = runCheck({ mode: "fast", rootPath: REPO_ROOT, format: "human" });
    delete process.env.HARNESS_CHECK_INJECT;

    expect(exitCode).toBe(1);
  });

  it("check --full is strict superset of --fast providers (M6-AC6)", () => {
    expect(CHECK_PROVIDER_NAMES.full.length).toBeGreaterThan(CHECK_PROVIDER_NAMES.fast.length);
    expect(CHECK_PROVIDER_NAMES.full).toEqual(
      expect.arrayContaining([...CHECK_PROVIDER_NAMES.fast]),
    );

    const fastExit = runCheck({ mode: "fast", rootPath: REPO_ROOT, format: "human" });
    const fullExit = runCheck({ mode: "full", rootPath: REPO_ROOT, format: "human" });
    expect(fastExit).toBe(0);
    expect(fullExit).toBe(0);
  });
});
