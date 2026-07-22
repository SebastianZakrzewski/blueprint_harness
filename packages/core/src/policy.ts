/**
 * Autonomy policy evaluation interfaces.
 * Default evaluator returns A0 until promotion evidence exists.
 */

/** Autonomy level from A0 (observe) through A4 (policy autonomous). */
export type AutonomyLevel = "A0" | "A1" | "A2" | "A3" | "A4";

/** Independent policy dimensions for autonomy evaluation. */
export type PolicyDimension =
  | "plan_approval"
  | "merge"
  | "staging_deploy"
  | "production_deploy"
  | "rollback"
  | "incident_response";

/** Evaluates the permitted autonomy level for a policy dimension. */
export interface PolicyEvaluator {
  /**
   * Returns the permitted autonomy level for a dimension.
   *
   * @param dimension - Policy dimension to evaluate.
   * @returns Permitted AutonomyLevel for the dimension.
   */
  evaluate(dimension: PolicyDimension): AutonomyLevel;
}

/**
 * Creates the default policy evaluator (A0 for all dimensions).
 *
 * Side effects: none.
 * Invariants: ignores the dimension argument until promotion logic ships (M14);
 * always returns A0 per M1 stub contract.
 *
 * @returns PolicyEvaluator that always returns A0.
 */
export function createDefaultPolicyEvaluator(): PolicyEvaluator {
  return {
    evaluate(_dimension: PolicyDimension): AutonomyLevel {
      return "A0";
    },
  };
}
