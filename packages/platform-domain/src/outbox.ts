import type { ResultEnvelopeV1 } from "@blueprint-harness/platform-contracts";

export type DeliveryStatus = "PENDING" | "DELIVERED" | "SYNC_PENDING";

export interface OutboxRecord {
  idempotencyKey: string;
  envelope: ResultEnvelopeV1;
  status: DeliveryStatus;
  attempts: number;
  lastError?: string;
}

/**
 * Durable in-memory outbox for completed Harness results (HP3).
 * Production uses PostgreSQL; local/tests use this store.
 */
export class DurableOutbox {
  private readonly records = new Map<string, OutboxRecord>();

  enqueue(envelope: ResultEnvelopeV1, idempotencyKey: string): OutboxRecord {
    const existing = this.records.get(idempotencyKey);
    if (existing) {
      return existing;
    }

    const record: OutboxRecord = {
      idempotencyKey,
      envelope,
      status: "PENDING",
      attempts: 0,
    };
    this.records.set(idempotencyKey, record);
    return record;
  }

  markSyncPending(idempotencyKey: string, error: string): OutboxRecord | undefined {
    const record = this.records.get(idempotencyKey);
    if (!record) {
      return undefined;
    }
    record.status = "SYNC_PENDING";
    record.attempts += 1;
    record.lastError = error;
    return record;
  }

  markDelivered(idempotencyKey: string): OutboxRecord | undefined {
    const record = this.records.get(idempotencyKey);
    if (!record) {
      return undefined;
    }
    record.status = "DELIVERED";
    return record;
  }

  listPending(): OutboxRecord[] {
    return [...this.records.values()].filter((r) => r.status !== "DELIVERED");
  }

  get(idempotencyKey: string): OutboxRecord | undefined {
    return this.records.get(idempotencyKey);
  }
}

export interface ReporterOptions {
  platformEnabled: boolean;
  deliver: (envelope: ResultEnvelopeV1, idempotencyKey: string) => Promise<void>;
}

/**
 * Publishes completed check results without requiring Platform availability (HP3).
 */
export class HarnessResultReporter {
  constructor(
    private readonly outbox: DurableOutbox,
    private readonly options: ReporterOptions,
  ) {}

  async publish(
    envelope: ResultEnvelopeV1,
    idempotencyKey: string,
  ): Promise<{ local: OutboxRecord; delivered: boolean }> {
    const local = this.outbox.enqueue(envelope, idempotencyKey);

    if (!this.options.platformEnabled) {
      return { local, delivered: false };
    }

    try {
      await this.options.deliver(envelope, idempotencyKey);
      this.outbox.markDelivered(idempotencyKey);
      return { local: this.outbox.get(idempotencyKey)!, delivered: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.outbox.markSyncPending(idempotencyKey, message);
      return { local: this.outbox.get(idempotencyKey)!, delivered: false };
    }
  }

  async retryPending(): Promise<number> {
    let delivered = 0;
    for (const record of this.outbox.listPending()) {
      if (record.status === "SYNC_PENDING" || record.status === "PENDING") {
        try {
          await this.options.deliver(record.envelope, record.idempotencyKey);
          this.outbox.markDelivered(record.idempotencyKey);
          delivered += 1;
        } catch {
          // remain SYNC_PENDING
        }
      }
    }
    return delivered;
  }
}
