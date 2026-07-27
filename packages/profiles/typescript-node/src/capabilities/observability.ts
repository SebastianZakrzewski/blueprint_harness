import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { OBSERVABILITY_VERSION_PINS } from "../observability/versions.js";

/** Paths added by the observability capability scaffold. */
export const OBSERVABILITY_SCAFFOLD_PATHS = [
  "docker/observability.compose.yaml",
  "src/observability/index.ts",
  "src/observability/telemetry.ts",
] as const;

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));

function mergePackageJson(projectRoot: string, extra: Record<string, unknown>): void {
  const packagePath = join(projectRoot, "package.json");
  const current = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
  writeFileSync(
    packagePath,
    JSON.stringify(
      {
        ...current,
        dependencies: {
          ...((current.dependencies as Record<string, string>) ?? {}),
          ...((extra.dependencies as Record<string, string>) ?? {}),
        },
      },
      null,
      2,
    ),
  );
}

/**
 * Adds Vector/Victoria observability scaffold and compose fragment (OD-003 pins).
 *
 * @param projectRoot - Target project directory.
 * @returns Relative paths written.
 */
export function scaffoldObservability(projectRoot: string): string[] {
  mergePackageJson(projectRoot, { dependencies: {} });

  const telemetryProvider = readFileSync(
    join(PACKAGE_ROOT, "..", "observability", "telemetry-provider.ts"),
    "utf8",
  );

  mkdirSync(join(projectRoot, "docker"), { recursive: true });
  mkdirSync(join(projectRoot, "src/observability"), { recursive: true });

  writeFileSync(
    join(projectRoot, "docker/observability.compose.yaml"),
    `services:
  vector:
    image: timberio/vector:${OBSERVABILITY_VERSION_PINS.vector}
    ports:
      - "\${VECTOR_PORT:-8686}:8686"
  victoria-logs:
    image: victoriametrics/victoria-logs:${OBSERVABILITY_VERSION_PINS.victoriaLogs}
    ports:
      - "\${VICTORIA_LOGS_PORT:-9428}:9428"
  victoria-metrics:
    image: victoriametrics/victoria-metrics:${OBSERVABILITY_VERSION_PINS.victoriaMetrics}
    ports:
      - "\${VICTORIA_METRICS_PORT:-8428}:8428"
  victoria-traces:
    image: victoriametrics/victoria-traces:${OBSERVABILITY_VERSION_PINS.victoriaTraces}
    ports:
      - "\${VICTORIA_TRACES_PORT:-10428}:10428"
`,
  );

  writeFileSync(join(projectRoot, "src/observability/telemetry.ts"), telemetryProvider);

  writeFileSync(
    join(projectRoot, "src/observability/index.ts"),
    `import { createTelemetryProvider } from "./telemetry.js";

export function createProjectTelemetry(worktreeId: string, traceId: string, requestId: string) {
  return createTelemetryProvider({ worktreeId, traceId, requestId });
}
`,
  );

  return [...OBSERVABILITY_SCAFFOLD_PATHS];
}
