/** Monitoring availability signal for production autonomy gating. */
export type MonitoringStatus = "OK" | "UNAVAILABLE";

export interface MonitoringState {
  status: MonitoringStatus;
  updatedAt: string;
  reason?: string;
}

const DEFAULT_STATE: MonitoringState = {
  status: "OK",
  updatedAt: new Date(0).toISOString(),
};

let monitoringState: MonitoringState = { ...DEFAULT_STATE };

/**
 * Returns the current monitoring status.
 */
export function getMonitoringStatus(): MonitoringStatus {
  return monitoringState.status;
}

/**
 * Returns the full monitoring state snapshot.
 */
export function getMonitoringState(): MonitoringState {
  return monitoringState;
}

/**
 * Sets monitoring status (used by recovery controls and gate fixtures).
 *
 * @param status - Monitoring availability status.
 * @param reason - Optional human-readable reason.
 */
export function setMonitoringStatus(status: MonitoringStatus, reason?: string): void {
  monitoringState = {
    status,
    updatedAt: new Date().toISOString(),
    reason,
  };
}

/**
 * Resets monitoring state for isolated tests.
 */
export function resetMonitoringStatus(): void {
  monitoringState = { ...DEFAULT_STATE };
}
