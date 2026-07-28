import type { AcceptedEvent } from "./ingestion.js";

export interface ReadModelSnapshot {
  projectId: string;
  sha: string;
  watermark: string;
  eventCount: number;
  provenance: string;
}

/**
 * Deterministic projector from accepted events (HP7).
 */
export class Projector {
  project(events: readonly AcceptedEvent[]): ReadModelSnapshot | null {
    if (events.length === 0) {
      return null;
    }
    const last = events[events.length - 1]!;
    return {
      projectId: last.envelope.projectId,
      sha: last.envelope.sha,
      watermark: last.acceptedAt,
      eventCount: events.length,
      provenance: "event-history-v1",
    };
  }

  rebuild(events: readonly AcceptedEvent[]): ReadModelSnapshot | null {
    return this.project([...events].sort((a, b) =>
      a.acceptedAt.localeCompare(b.acceptedAt),
    ));
  }
}
