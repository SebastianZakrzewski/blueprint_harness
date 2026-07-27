import { describe, expect, it } from "vitest";

import { buildValidationResult } from "@blueprint-harness/core";

import type {
  CapabilityResolutionProposal,
  ProfileContext,
  StackProfile,
} from "../src/index.js";

const ok = () => buildValidationResult([]);

function createMockProfile(): StackProfile {
  return {
    id: "mock-profile",
    version: "0.0.0",
    detect: async (_context: ProfileContext) => ok(),
    scaffold: async (
      _context: ProfileContext,
      _proposal: CapabilityResolutionProposal,
    ) => ok(),
    check: async (_context: ProfileContext, _mode: "fast" | "full") => ok(),
    env: async (_context: ProfileContext, _action: "up" | "down" | "status") => ok(),
    arch: async (_context: ProfileContext) => ok(),
    build: async (_context: ProfileContext) => ok(),
    deploy: async (_context: ProfileContext, _target: "staging" | "production") => ok(),
    rollback: async (_context: ProfileContext, _target: "staging" | "production") => ok(),
  };
}

describe("StackProfile contract (M5-AC1, M5-AC4)", () => {
  it("mock profile satisfies StackProfile interface with all operations", async () => {
    const profile: StackProfile = createMockProfile();
    const context: ProfileContext = { projectRoot: "/tmp/project", profileId: "mock-profile" };
    const proposal: CapabilityResolutionProposal = {
      capabilities: ["base"],
      installOrder: ["base"],
    };

    expect(profile.id).toBe("mock-profile");
    expect(await profile.detect(context)).toEqual(ok());
    expect(await profile.scaffold(context, proposal)).toEqual(ok());
    expect(await profile.check(context, "fast")).toEqual(ok());
    expect(await profile.env(context, "status")).toEqual(ok());
    expect(await profile.arch(context)).toEqual(ok());
    expect(await profile.build(context)).toEqual(ok());
    expect(await profile.deploy(context, "staging")).toEqual(ok());
    expect(await profile.rollback(context, "production")).toEqual(ok());
  });
});
