import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runCheck } from "@blueprint-harness/cli";

const REPO_ROOT = join(fileURLToPath(import.meta.url), "..", "..");

describe("structural check integration (M11)", () => {
  it("check --fast completes on reference project within budget (M11-AC3)", () => {
    const start = Date.now();
    const exitCode = runCheck({
      mode: "fast",
      rootPath: join(REPO_ROOT, "fixtures", "reference-project"),
      format: "human",
    });
    const elapsedMs = Date.now() - start;

    expect(exitCode).toBe(0);
    expect(elapsedMs).toBeLessThan(30_000);
  });
});
