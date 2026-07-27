import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { readHarnessLock, runUpgrade } from "../src/upgrade/index.js";

function seedLock(dir: string, version = "0.0.0"): void {
  mkdirSync(join(dir, "docs"), { recursive: true });
  writeFileSync(
    join(dir, "harness.lock.json"),
    JSON.stringify({
      core: version,
      template: version,
      profileSdk: version,
      profile: "typescript-node",
      capabilities: ["base"],
      blueprintVersion: version,
    }),
    null,
    2,
  );
  writeFileSync(join(dir, "docs", "DESIGN.md"), "# Project design\n", "utf8");
}

describe("upgrade engine (M15)", () => {
  it("dry-run plans upgrade without lock mutation (M15-AC1)", () => {
    const target = mkdtempSync(join(tmpdir(), "upgrade-dry-"));
    try {
      seedLock(target, "0.0.0");

      const report = runUpgrade({
        projectRoot: target,
        targetBlueprintVersion: "0.1.0",
        dryRun: true,
      });

      expect(report.ok).toBe(true);
      expect(report.lockUpdated).toBe(false);
      expect(readHarnessLock(target)?.blueprintVersion).toBe("0.0.0");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("blocks incompatible profile before lock bump (M15-AC4)", () => {
    const target = mkdtempSync(join(tmpdir(), "upgrade-incompat-"));
    try {
      seedLock(target);
      const report = runUpgrade({
        projectRoot: target,
        targetBlueprintVersion: "0.1.0",
        targetProfile: "other-profile",
      });
      expect(report.ok).toBe(false);
      expect(report.lockUpdated).toBe(false);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("completed upgrade rerun is idempotent (M15-AC5)", () => {
    const target = mkdtempSync(join(tmpdir(), "upgrade-idempotent-"));
    try {
      seedLock(target, "0.0.0");
      runUpgrade({ projectRoot: target, targetBlueprintVersion: "0.1.0" });
      const second = runUpgrade({ projectRoot: target, targetBlueprintVersion: "0.1.0" });
      expect(second.ok).toBe(true);
      expect(second.lockUpdated).toBe(false);
      expect(readHarnessLock(target)?.blueprintVersion).toBe("0.1.0");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("preserves PROJECT_OWNED doc bytes (M15-AC2)", () => {
    const target = mkdtempSync(join(tmpdir(), "upgrade-owned-"));
    try {
      seedLock(target);
      const before = readFileSync(join(target, "docs", "DESIGN.md"), "utf8");
      runUpgrade({ projectRoot: target, targetBlueprintVersion: "0.1.0" });
      const after = readFileSync(join(target, "docs", "DESIGN.md"), "utf8");
      expect(after).toBe(before);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
