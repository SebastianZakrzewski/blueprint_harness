import { describe, expect, it } from "vitest";

import {
  createDefaultPolicyEvaluator,
  type PolicyDimension,
} from "../src/policy.js";

const DIMENSIONS: PolicyDimension[] = [
  "plan_approval",
  "merge",
  "staging_deploy",
  "production_deploy",
  "rollback",
  "incident_response",
];

describe("policy", () => {
  it("default evaluator returns A0 for every policy dimension", () => {
    const evaluator = createDefaultPolicyEvaluator();

    for (const dimension of DIMENSIONS) {
      expect(evaluator.evaluate(dimension)).toBe("A0");
    }
  });
});
