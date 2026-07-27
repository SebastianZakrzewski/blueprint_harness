/** OD-003 approved Vector/Victoria version pins for M13. */
export const OBSERVABILITY_VERSION_PINS = {
  vector: "0.42.0-alpine",
  victoriaLogs: "v1.4.0-victorialogs",
  victoriaMetrics: "v1.101.0",
  victoriaTraces: "v0.1.0",
} as const;

/** Verified compatibility matrix recorded in Decision Log OD-003. */
export const OBSERVABILITY_COMPATIBILITY_MATRIX = [
  {
    vector: OBSERVABILITY_VERSION_PINS.vector,
    victoriaLogs: OBSERVABILITY_VERSION_PINS.victoriaLogs,
    victoriaMetrics: OBSERVABILITY_VERSION_PINS.victoriaMetrics,
    victoriaTraces: OBSERVABILITY_VERSION_PINS.victoriaTraces,
    queryApis: ["LogSQL", "PromQL", "TraceQL"],
  },
] as const;
