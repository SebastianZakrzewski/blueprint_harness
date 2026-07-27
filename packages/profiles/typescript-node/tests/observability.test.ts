import { describe, expect, it } from "vitest";

import {
  createTelemetryProvider,
  redactTelemetryFields,
} from "../src/observability/telemetry-provider.js";
import {
  buildLogsQueryUrl,
  buildMetricsQuery,
  buildTracesQuery,
} from "../src/observability/query-helpers.js";
import { runObservabilityLint } from "../src/observability/lint.js";
import { OBSERVABILITY_VERSION_PINS } from "../src/observability/versions.js";
import { scaffoldObservability } from "../src/capabilities/observability.js";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("observability (M13)", () => {
  it("records OD-003 version pins (M13-AC6)", () => {
    expect(OBSERVABILITY_VERSION_PINS.vector).toBe("0.42.0-alpine");
    expect(OBSERVABILITY_VERSION_PINS.victoriaLogs).toContain("v1.4.0");
  });

  it("includes correlation fields and redacts secrets (M13-AC3, M13-AC4)", () => {
    const provider = createTelemetryProvider({
      worktreeId: "wt-1",
      traceId: "trace-1",
      requestId: "req-1",
    });

    const event = provider.emit("info", "hello", { apiKey: "secret-value", userId: "42" });
    expect(event.fields.worktreeId).toBe("wt-1");
    expect(event.fields.traceId).toBe("trace-1");
    expect(event.fields.requestId).toBe("req-1");
    expect(event.fields.apiKey).toBe("[REDACTED]");
    expect(redactTelemetryFields({ password: "x" }).password).toBe("[REDACTED]");
  });

  it("builds query helpers for logs metrics traces (M13-AC1, M13-AC2)", () => {
    expect(buildLogsQueryUrl("wt-1")).toContain("worktreeId:wt-1");
    expect(buildMetricsQuery("wt-1")).toContain('worktreeId="wt-1"');
    expect(buildTracesQuery("wt-1")).toContain("worktreeId");
  });

  it("flags duplicate instrumentation paths (M13 duplicate check)", () => {
    const target = mkdtempSync(join(tmpdir(), "obs-lint-"));
    try {
      mkdirSync(join(target, "src"), { recursive: true });
      writeFileSync(
        join(target, "src/a.ts"),
        `import "@opentelemetry/api"; import { createTelemetryProvider } from "./telemetry";`,
      );
      const result = runObservabilityLint(target);
      expect(result.ok).toBe(false);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("scaffolds observability compose with pinned images (M13-AC7 positive)", () => {
    const target = mkdtempSync(join(tmpdir(), "obs-scaffold-"));
    try {
      writeFileSync(join(target, "package.json"), JSON.stringify({ name: "app" }));
      scaffoldObservability(target);
      const compose = readFileSync(join(target, "docker/observability.compose.yaml"), "utf8");
      expect(compose).toContain(OBSERVABILITY_VERSION_PINS.vector);
      expect(compose).toContain("victoria-logs");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
