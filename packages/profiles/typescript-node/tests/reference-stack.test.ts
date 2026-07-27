import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { REFERENCE_STACK_PROPOSAL, scaffoldCapabilities } from "../src/index.js";

const REPO_ROOT = join(fileURLToPath(import.meta.url), "..", "..", "..", "..", "..");
const REFERENCE_DOCS = join(REPO_ROOT, "fixtures", "reference-project", "docs");

describe("reference stack scaffold (M9c)", () => {
  it("generates supabase and mastra files for full reference proposal", () => {
    const target = mkdtempSync(join(tmpdir(), "profile-ref-"));

    const { result, written } = scaffoldCapabilities(target, REFERENCE_STACK_PROPOSAL);
    expect(result.ok).toBe(true);

    expect(existsSync(join(target, "supabase/config.toml"))).toBe(true);
    expect(existsSync(join(target, "src/mastra/index.ts"))).toBe(true);
    expect(written).toEqual(
      expect.arrayContaining(["supabase/config.toml", "src/mastra/index.ts"]),
    );

    rmSync(target, { recursive: true, force: true });
  });

  it("reference-project docs fixture exists (M9-AC8)", () => {
    expect(existsSync(REFERENCE_DOCS)).toBe(true);
    expect(existsSync(join(REFERENCE_DOCS, "AGENTS.md"))).toBe(true);
  });
});
