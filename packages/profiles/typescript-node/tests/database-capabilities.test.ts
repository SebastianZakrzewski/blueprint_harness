import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { scaffoldCapabilities } from "../src/scaffold.js";

const DATABASE_PROPOSAL = {
  capabilities: ["base", "nestjs", "database"],
  installOrder: ["base", "nestjs", "database"],
};

describe("database capabilities (M9b)", () => {
  it("scaffolds nestjs and database files when enabled", () => {
    const target = mkdtempSync(join(tmpdir(), "profile-db-"));

    const { result, written } = scaffoldCapabilities(target, DATABASE_PROPOSAL);
    expect(result.ok).toBe(true);
    expect(written).toEqual(
      expect.arrayContaining([
        "src/app.module.ts",
        "drizzle.config.ts",
        "docker/postgres.compose.yaml",
      ]),
    );

    expect(existsSync(join(target, "src/app.module.ts"))).toBe(true);
    expect(existsSync(join(target, "src/db/schema.ts"))).toBe(true);
    expect(existsSync(join(target, "docker/postgres.compose.yaml"))).toBe(true);

    rmSync(target, { recursive: true, force: true });
  });
});
