import {
  parseResultEnvelope,
  type ResultEnvelopeV1,
} from "@blueprint-harness/platform-contracts";
import { createHash } from "node:crypto";

export type IngestOutcome =
  | { status: "ACCEPTED"; eventId: string }
  | { status: "DUPLICATE"; eventId: string }
  | { status: "REJECTED"; code: string; message: string }
  | { status: "QUARANTINED"; eventId: string; reason: string };

export interface AcceptedEvent {
  eventId: string;
  idempotencyKey: string;
  envelope: ResultEnvelopeV1;
  payloadHash: string;
  acceptedAt: string;
}

/**
 * Append-only accepted event history with idempotency (HP4).
 */
export class EventHistory {
  private readonly byIdempotency = new Map<string, AcceptedEvent>();
  private readonly events: AcceptedEvent[] = [];

  ingest(raw: string, _idempotencyKey?: string): IngestOutcome {
    const parsed = parseResultEnvelope(raw);
    if (!parsed.ok) {
      if (parsed.code === "ENVELOPE_SENSITIVE_CONTENT") {
        const eventId = `q-${createHash("sha256").update(raw).digest("hex").slice(0, 12)}`;
        return { status: "QUARANTINED", eventId, reason: parsed.message };
      }
      return { status: "REJECTED", code: parsed.code, message: parsed.message };
    }

    const existing = this.byIdempotency.get(parsed.idempotencyKey);
    if (existing) {
      if (existing.payloadHash !== parsed.envelope.payloadHash) {
        return {
          status: "REJECTED",
          code: "INTEGRITY_CONFLICT",
          message: "Same identity with different payload hash",
        };
      }
      return { status: "DUPLICATE", eventId: existing.eventId };
    }

    const event: AcceptedEvent = {
      eventId: parsed.envelope.eventId,
      idempotencyKey: parsed.idempotencyKey,
      envelope: parsed.envelope,
      payloadHash: parsed.envelope.payloadHash,
      acceptedAt: new Date().toISOString(),
    };
    this.byIdempotency.set(parsed.idempotencyKey, event);
    this.events.push(event);
    return { status: "ACCEPTED", eventId: event.eventId };
  }

  all(): readonly AcceptedEvent[] {
    return this.events;
  }

  rebuild(): AcceptedEvent[] {
    return [...this.events];
  }
}
