/**
 * Audit event types for Harness operations.
 * Secret values must never appear in audit metadata.
 */

/** Categories of auditable Harness events. */
export type AuditEventType =
  | "state_transition"
  | "policy_evaluation"
  | "checkpoint_recorded"
  | "validation_completed";

/** Input for creating an audit event (eventId is assigned automatically). */
export interface AuditEventInput {
  correlationId: string;
  timestamp: string;
  actor: string;
  action: string;
  eventType: AuditEventType;
  metadata?: Record<string, string | number | boolean>;
}

/** Recorded audit event with stable identifier. */
export interface AuditEvent extends AuditEventInput {
  eventId: string;
}

let auditEventCounter = 0;

/**
 * Creates a validated audit event with a generated eventId.
 *
 * Side effects: increments an internal event counter (module scope).
 * Invariants: required string fields must be non-empty; metadata must not contain secrets.
 *
 * @param input - Event fields excluding eventId.
 * @returns AuditEvent with generated eventId.
 * @throws Error when required fields are missing or empty.
 */
export function createAuditEvent(input: AuditEventInput): AuditEvent {
  if (input.correlationId.length === 0) {
    throw new Error("AuditEvent.correlationId must be non-empty");
  }
  if (input.actor.length === 0) {
    throw new Error("AuditEvent.actor must be non-empty");
  }
  if (input.action.length === 0) {
    throw new Error("AuditEvent.action must be non-empty");
  }
  if (input.timestamp.length === 0) {
    throw new Error("AuditEvent.timestamp must be non-empty");
  }

  auditEventCounter += 1;
  return {
    ...input,
    eventId: `audit-${auditEventCounter}`,
  };
}

/**
 * Resets the audit event counter (for tests only).
 *
 * @internal
 */
export function resetAuditEventCounter(): void {
  auditEventCounter = 0;
}
