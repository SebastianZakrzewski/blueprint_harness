import { describe, expect, it, afterEach } from "vitest";

import {
  attemptSelfPromotion,
  evaluateAutonomyRequest,
  evaluatePermissionAction,
  isAutonomyFrozen,
  resetAutonomyState,
} from "@blueprint-harness/core";

describe("permission boundary gate (M14c)", () => {
  afterEach(() => {
    resetAutonomyState();
  });

  it("rejects SSH, secret read, and direct DB write (M14-AC5)", () => {
    expect(evaluatePermissionAction("ssh_remote").ok).toBe(false);
    expect(evaluatePermissionAction("read_secret").ok).toBe(false);
    expect(evaluatePermissionAction("direct_db_write").ok).toBe(false);
  });

  it("self-promotion triggers freeze (M14-AC4)", () => {
    const result = attemptSelfPromotion("A3");
    expect(result.allowed).toBe(false);
    expect(isAutonomyFrozen()).toBe(true);
  });

  it("rejects A3+ production autonomy with undefined thresholds (M14-AC7)", () => {
    const decision = evaluateAutonomyRequest("production_deploy", "A3");
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain("UNDEFINED production thresholds");
  });

  it("allows staging autonomy when thresholds undefined (M14-AC6)", () => {
    const decision = evaluateAutonomyRequest("staging_deploy", "A0");
    expect(decision.allowed).toBe(true);
  });
});
