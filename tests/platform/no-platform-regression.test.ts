import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { validateDocs } from "@blueprint-harness/core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLATFORM_PACKAGE_PREFIX = "platform-";
const PLATFORM_APP_NAMES = new Set([
  "platform-api",
  "platform-workers",
  "control-panel",
]);

/**
 * HP0 regression guard: Blueprint checks succeed before Platform packages exist.
 */
describe("no-platform regression (HP0)", () => {
  it("has no platform packages or apps scaffolded before HP1", () => {
    const packagesDir = join(ROOT, "packages");
    const packageNames = existsSync(packagesDir)
      ? readdirSync(packagesDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
      : [];

    for (const name of packageNames) {
      expect(name.startsWith(PLATFORM_PACKAGE_PREFIX)).toBe(false);
    }

    const appsDir = join(ROOT, "apps");
    if (existsSync(appsDir)) {
      for (const name of readdirSync(appsDir, { withFileTypes: true })) {
        if (name.isDirectory()) {
          expect(PLATFORM_APP_NAMES.has(name.name)).toBe(false);
        }
      }
    }
  });

  it("validate-docs passes without Platform implementation", () => {
    const result = validateDocs(ROOT);
    expect(result.ok).toBe(true);
  });
});
