import { describe, expect, it, afterEach } from "vitest";

import {
  applyMonitoringUnavailableFreeze,
  freezeAutonomy,
  getRolloutControlState,
  isProductionAutonomyBlocked,
  resetMonitoringStatus,
  resetRolloutControl,
  setMonitoringStatus,
} from "@blueprint-harness/core";

describe("recovery freeze gate (M14b)", () => {
  afterEach(() => {
    resetMonitoringStatus();
    resetRolloutControl();
  });

  it("blocks production autonomy when monitoring unavailable (M14-AC3)", () => {
    setMonitoringStatus("UNAVAILABLE", "collector down");
    const result = applyMonitoringUnavailableFreeze();

    expect(result.ok).toBe(false);
    expect(result.findings[0]?.message).toContain("MONITORING_STATUS: UNAVAILABLE");
    expect(isProductionAutonomyBlocked()).toBe(true);
    expect(getRolloutControlState()).toBe("AUTONOMY_FROZEN");
  });

  it("freezes autonomy on explicit freeze signal (M14-AC4 prep)", () => {
    freezeAutonomy();
    expect(isProductionAutonomyBlocked()).toBe(true);
  });
});
