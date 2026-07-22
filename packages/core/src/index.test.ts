import { describe, expect, it } from "vitest";

import {
  BOOTSTRAP_STATE_COUNT,
  INVARIANT_COUNT,
  createDefaultPolicyEvaluator,
  deserializeValidationResult,
  packageIdentity,
} from "./index.js";

describe("@blueprint-harness/core", () => {
  it("exposes package identity", () => {
    expect(packageIdentity.name).toBe("@blueprint-harness/core");
    expect(packageIdentity.version).toBe("0.0.0");
  });

  it("exports core contracts for downstream packages", () => {
    expect(INVARIANT_COUNT).toBe(18);
    expect(BOOTSTRAP_STATE_COUNT).toBe(8);
    expect(createDefaultPolicyEvaluator().evaluate("merge")).toBe("A0");
    expect(
      deserializeValidationResult({ ok: true, findings: [] }).ok,
    ).toBe(true);
  });
});
