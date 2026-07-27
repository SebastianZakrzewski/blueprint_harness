import type { AutonomyLevel, PolicyDimension } from "../policy.js";
import { isProductionAutonomyBlocked } from "../recovery/index.js";

/** Production rollout thresholds remain UNDEFINED for V1 (OD-008). */
export const PRODUCTION_THRESHOLDS_DEFINED = false;

export interface AutonomyStatusReport {
  currentLevel: AutonomyLevel;
  frozen: boolean;
  productionThresholdsDefined: boolean;
  dimensions: Record<PolicyDimension, AutonomyLevel>;
  stagingGateAllowed: boolean;
  productionGateAllowed: boolean;
}

let autonomyFrozen = false;
let selfPromotionAttempts = 0;

/**
 * Returns whether autonomy is globally frozen.
 */
export function isAutonomyFrozen(): boolean {
  return autonomyFrozen || isProductionAutonomyBlocked();
}

/**
 * Records an autonomy freeze event.
 */
export function triggerAutonomyFreeze(reason: string): void {
  autonomyFrozen = true;
  selfPromotionAttempts += 1;
  void reason;
}

/**
 * Resets autonomy freeze state for tests.
 */
export function resetAutonomyState(): void {
  autonomyFrozen = false;
  selfPromotionAttempts = 0;
}

/**
 * Evaluates whether a requested autonomy level is permitted for a dimension.
 *
 * @param dimension - Policy dimension.
 * @param requestedLevel - Requested autonomy level.
 */
export function evaluateAutonomyRequest(
  dimension: PolicyDimension,
  requestedLevel: AutonomyLevel,
): { allowed: boolean; reason?: string } {
  if (isAutonomyFrozen()) {
    return { allowed: false, reason: "AUTONOMY_FREEZE active." };
  }

  const levelRank: Record<AutonomyLevel, number> = { A0: 0, A1: 1, A2: 2, A3: 3, A4: 4 };
  const permitted: AutonomyLevel = "A0";

  if (levelRank[requestedLevel] > levelRank[permitted]) {
    if (dimension === "production_deploy" && !PRODUCTION_THRESHOLDS_DEFINED) {
      return {
        allowed: false,
        reason: "UNDEFINED production thresholds block A3+ production autonomy (OD-008).",
      };
    }

    return {
      allowed: false,
      reason: `Requested ${requestedLevel} exceeds permitted ${permitted} for ${dimension}.`,
    };
  }

  if (dimension === "production_deploy" && isProductionAutonomyBlocked()) {
    return {
      allowed: false,
      reason: "MONITORING_STATUS: UNAVAILABLE blocks production autonomy.",
    };
  }

  return { allowed: true };
}

/**
 * Handles self-promotion attempts (must trigger freeze per M14-AC4).
 */
export function attemptSelfPromotion(targetLevel: AutonomyLevel): { allowed: boolean } {
  triggerAutonomyFreeze(`self-promotion to ${targetLevel}`);
  return { allowed: false };
}

/**
 * Builds autonomy status report for CLI output.
 */
export function buildAutonomyStatusReport(): AutonomyStatusReport {
  const dimensions: PolicyDimension[] = [
    "plan_approval",
    "merge",
    "staging_deploy",
    "production_deploy",
    "rollback",
    "incident_response",
  ];

  const dimensionLevels = Object.fromEntries(
    dimensions.map((dimension) => [dimension, "A0" as AutonomyLevel]),
  ) as Record<PolicyDimension, AutonomyLevel>;

  const frozen = isAutonomyFrozen();

  return {
    currentLevel: "A0",
    frozen,
    productionThresholdsDefined: PRODUCTION_THRESHOLDS_DEFINED,
    dimensions: dimensionLevels,
    stagingGateAllowed: !frozen,
    productionGateAllowed: !frozen && !isProductionAutonomyBlocked() && PRODUCTION_THRESHOLDS_DEFINED,
  };
}
