const SECRET_KEY_PATTERN = /(password|secret|api[_-]?key|token|authorization)/i;

/**
 * Redacts sensitive telemetry field keys before export.
 *
 * @param fields - Raw telemetry fields.
 * @returns Stringified fields with secrets redacted.
 */
export function redactTelemetryFields(fields: Record<string, unknown>): Record<string, string> {
  const redacted: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    redacted[key] = SECRET_KEY_PATTERN.test(key) ? "[REDACTED]" : String(value);
  }

  return redacted;
}

export interface TelemetryContext {
  worktreeId: string;
  traceId: string;
  requestId: string;
}

export interface TelemetryEvent {
  level: string;
  message: string;
  fields: Record<string, string>;
}

/**
 * Single instrumentation provider with required correlation fields.
 *
 * @param context - Correlation identifiers for the active worktree request.
 * @returns Telemetry emitter that enforces correlation and redaction.
 */
export function createTelemetryProvider(context: TelemetryContext): {
  emit: (level: string, message: string, fields?: Record<string, unknown>) => TelemetryEvent;
} {
  return {
    emit(level: string, message: string, fields: Record<string, unknown> = {}): TelemetryEvent {
      const enriched = {
        worktreeId: context.worktreeId,
        traceId: context.traceId,
        requestId: context.requestId,
        ...redactTelemetryFields(fields),
      };

      return { level, message, fields: enriched };
    },
  };
}
