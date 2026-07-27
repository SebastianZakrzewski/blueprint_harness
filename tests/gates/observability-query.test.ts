import { describe, expect, it } from "vitest";

import {
  buildLogsQueryUrl,
  buildMetricsQuery,
  buildTracesQuery,
  createTelemetryProvider,
  OBSERVABILITY_VERSION_PINS,
} from "@blueprint-harness/profiles-typescript-node";

describe("observability query gate (M13)", () => {
  it("exposes query contracts for pinned Victoria stack (M13-AC1, M13-AC2)", () => {
    const worktreeId = "gate-worktree";
    expect(buildLogsQueryUrl(worktreeId)).toContain(worktreeId);
    expect(buildMetricsQuery(worktreeId)).toContain(worktreeId);
    expect(buildTracesQuery(worktreeId)).toContain(worktreeId);
  });

  it("telemetry events carry correlation identifiers (M13-AC3)", () => {
    const event = createTelemetryProvider({
      worktreeId: "wt-gate",
      traceId: "trace-gate",
      requestId: "req-gate",
    }).emit("info", "gate");

    expect(event.fields).toMatchObject({
      worktreeId: "wt-gate",
      traceId: "trace-gate",
      requestId: "req-gate",
    });
  });

  it("uses OD-003 pins in gate fixtures (M13-AC6)", () => {
    expect(OBSERVABILITY_VERSION_PINS.victoriaMetrics).toBe("v1.101.0");
  });
});
