import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import {
  cleanupEnvironment,
  deriveWorktreeId,
  getEnvironmentStatus,
  provisionEnvironment,
} from "@blueprint-harness/core";

describe("two-worktree isolation gate (M10)", () => {
  it("assigns distinct ports and DB boundaries (M10-AC1)", () => {
    const worktreeA = mkdtempSync(join(tmpdir(), "harness-wt-a-"));
    const worktreeB = mkdtempSync(join(tmpdir(), "harness-wt-b-"));

    const envA = provisionEnvironment(worktreeA);
    const envB = provisionEnvironment(worktreeB);

    expect(envA.worktreeId).not.toBe(envB.worktreeId);
    expect(envA.appPort).not.toBe(envB.appPort);
    expect(envA.databasePort).not.toBe(envB.databasePort);
    expect(envA.databaseName).not.toBe(envB.databaseName);

    rmSync(worktreeA, { recursive: true, force: true });
    rmSync(worktreeB, { recursive: true, force: true });
  });

  it("status omits secrets (M10-AC2)", () => {
    const worktree = mkdtempSync(join(tmpdir(), "harness-wt-status-"));
    provisionEnvironment(worktree);

    const status = getEnvironmentStatus(worktree);
    expect(status.health).toBe("ok");
    expect(JSON.stringify(status)).not.toMatch(/password|secret|token/i);

    rmSync(worktree, { recursive: true, force: true });
  });

  it("down clears only tagged resources for worktree (M10-AC3)", () => {
    const worktree = mkdtempSync(join(tmpdir(), "harness-wt-down-"));
    provisionEnvironment(worktree);

    const down = cleanupEnvironment(worktree);
    expect(down?.taggedResources).toEqual([]);
    expect(getEnvironmentStatus(worktree).status).toBe("down");

    rmSync(worktree, { recursive: true, force: true });
  });

  it("resume after interrupt is idempotent (M10-AC4, M10-AC5)", () => {
    const worktree = mkdtempSync(join(tmpdir(), "harness-wt-resume-"));
    const first = provisionEnvironment(worktree);
    const second = provisionEnvironment(worktree);

    expect(second.appPort).toBe(first.appPort);
    expect(second.databasePort).toBe(first.databasePort);
    expect(deriveWorktreeId(worktree)).toBe(first.worktreeId);

    rmSync(worktree, { recursive: true, force: true });
  });
});
