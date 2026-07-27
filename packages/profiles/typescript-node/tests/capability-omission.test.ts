import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import {
  DEFAULT_BASE_PROPOSAL,
  OMITTED_CAPABILITY_MARKERS,
  scaffoldCapabilities,
  verifyCapabilityOmission,
} from "../src/index.js";

describe("capability omission (M9-AC1)", () => {
  it("base-only scaffold has no NestJS/DB/Supabase/Mastra markers", () => {
    const target = mkdtempSync(join(tmpdir(), "profile-base-"));

    const { result } = scaffoldCapabilities(target, DEFAULT_BASE_PROPOSAL);
    expect(result.ok).toBe(true);

    const omission = verifyCapabilityOmission(
      target,
      DEFAULT_BASE_PROPOSAL.capabilities,
      OMITTED_CAPABILITY_MARKERS,
    );
    expect(omission.ok).toBe(true);

    expect(existsSync(join(target, "src/app.module.ts"))).toBe(false);
    expect(existsSync(join(target, "drizzle.config.ts"))).toBe(false);
    expect(existsSync(join(target, "supabase"))).toBe(false);
    expect(existsSync(join(target, "src/mastra"))).toBe(false);

    rmSync(target, { recursive: true, force: true });
  });
});
