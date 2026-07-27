import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { runUpgrade } from "@blueprint-harness/core";

import { mkdirSync, writeFileSync } from "node:fs";

function seed(dir: string): void {
  mkdirSync(join(dir, "docs"), { recursive: true });
  writeFileSync(
    join(dir, "harness.lock.json"),
    JSON.stringify({
      core: "0.0.0",
      template: "0.0.0",
      profileSdk: "0.0.0",
      profile: "typescript-node",
      capabilities: ["base"],
      blueprintVersion: "0.0.0",
    }),
  );
}

describe("upgrade round-trip gate (M15)", () => {
  it("performs upgrade round-trip without lock corruption (M15-AC5)", () => {
    const target = mkdtempSync(join(tmpdir(), "upgrade-gate-"));
    try {
      seed(target);
      const first = runUpgrade({ projectRoot: target, targetBlueprintVersion: "0.1.0" });
      const second = runUpgrade({ projectRoot: target, targetBlueprintVersion: "0.1.0" });
      expect(first.ok).toBe(true);
      expect(second.ok).toBe(true);
      expect(second.phase).toBe("COMPLETED");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
