import { afterEach, describe, expect, it } from "vitest";

import {
  createAuditEvent,
  resetAuditEventCounter,
} from "../src/audit.js";

describe("audit", () => {
  afterEach(() => {
    resetAuditEventCounter();
  });

  it("creates an audit event with a generated eventId", () => {
    const event = createAuditEvent({
      correlationId: "corr-1",
      timestamp: "2026-07-23T00:00:00.000Z",
      actor: "harness-core",
      action: "validation_completed",
      eventType: "validation_completed",
    });

    expect(event.eventId).toBe("audit-1");
    expect(event.correlationId).toBe("corr-1");
  });

  it("rejects empty required fields", () => {
    expect(() =>
      createAuditEvent({
        correlationId: "",
        timestamp: "2026-07-23T00:00:00.000Z",
        actor: "harness-core",
        action: "validation_completed",
        eventType: "validation_completed",
      }),
    ).toThrow("AuditEvent.correlationId must be non-empty");
  });
});
