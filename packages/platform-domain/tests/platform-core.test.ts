import { buildResultEnvelope } from "@blueprint-harness/platform-contracts";
import { describe, expect, it } from "vitest";

import {
  ArchitectureProjector,
  CriteriaEngine,
  DurableOutbox,
  EventHistory,
  EvidenceIndex,
  HarnessResultReporter,
  Projector,
  Reconciler,
  ScopeCoordinator,
  SnapshotPolicy,
} from "../src/index.js";

function envelope(sha = "b".repeat(40)) {
  return buildResultEnvelope({
    eventId: `evt-${sha.slice(0, 8)}`,
    eventType: "harness.check.completed",
    projectId: "proj-1",
    repositoryId: "repo-1",
    sha,
    run: {
      runId: "run-1",
      attempt: 1,
      trigger: "ci",
      startedAt: "2026-07-28T00:00:00.000Z",
    },
    producer: { type: "harness-cli", id: "cli", version: "1" },
    criteriaIds: [],
    findings: [],
    artifactReferences: [],
    observedAt: "2026-07-28T00:00:01.000Z",
  });
}

describe("platform-domain HP3-HP11", () => {
  it("HP3: platform outage leaves local outbox SYNC_PENDING", async () => {
    const outbox = new DurableOutbox();
    const reporter = new HarnessResultReporter(outbox, {
      platformEnabled: true,
      deliver: async () => {
        throw new Error("platform down");
      },
    });
    const env = envelope();
    const result = await reporter.publish(env, "key-1");
    expect(result.delivered).toBe(false);
    expect(outbox.get("key-1")?.status).toBe("SYNC_PENDING");
  });

  it("HP3: project without platform makes no delivery", async () => {
    const outbox = new DurableOutbox();
    let called = false;
    const reporter = new HarnessResultReporter(outbox, {
      platformEnabled: false,
      deliver: async () => {
        called = true;
      },
    });
    await reporter.publish(envelope(), "key-2");
    expect(called).toBe(false);
  });

  it("HP4: idempotent ingest and integrity conflict", () => {
    const history = new EventHistory();
    const env1 = envelope();
    const first = history.ingest(JSON.stringify(env1), "ignored");
    const dup = history.ingest(JSON.stringify(env1), "ignored");
    expect(first.status).toBe("ACCEPTED");
    expect(dup.status).toBe("DUPLICATE");

    const env2 = buildResultEnvelope({
      eventId: env1.eventId,
      eventType: env1.eventType,
      projectId: env1.projectId,
      repositoryId: env1.repositoryId,
      sha: env1.sha,
      run: env1.run,
      producer: env1.producer,
      criteriaIds: env1.criteriaIds,
      findings: [{ id: "F1", severity: "warning", message: "drift" }],
      artifactReferences: env1.artifactReferences,
      observedAt: env1.observedAt,
    });
    const conflict = history.ingest(JSON.stringify(env2), "ignored");
    expect(conflict.status).toBe("REJECTED");
    if (conflict.status === "REJECTED") {
      expect(conflict.code).toBe("INTEGRITY_CONFLICT");
    }
  });

  it("HP5: criteria graph validation", () => {
    const engine = new CriteriaEngine({
      version: "1",
      nodes: [
        { id: "A", dependsOn: [] },
        { id: "B", dependsOn: ["A"] },
      ],
    });
    expect(engine.validateGraph()).toEqual([]);
    const evaluated = engine.evaluate(new Set(["A", "B"]));
    expect(evaluated.get("B")).toBe("PASS");
  });

  it("HP6: scope conflict detection", () => {
    const coordinator = new ScopeCoordinator();
    const first = coordinator.register({
      planId: "p1",
      version: "1",
      exclusivePaths: ["packages/core"],
      owner: "agent",
    });
    expect(first.ok).toBe(true);
    const second = coordinator.register({
      planId: "p2",
      version: "1",
      exclusivePaths: ["packages/core"],
      owner: "agent",
    });
    expect(second.ok).toBe(false);
  });

  it("HP7: deterministic projector rebuild", () => {
    const history = new EventHistory();
    const env = envelope();
    history.ingest(JSON.stringify(env), "k1");
    const projector = new Projector();
    const snapshot = projector.rebuild(history.all());
    expect(snapshot?.sha).toBe(env.sha);
    expect(snapshot?.eventCount).toBe(1);
  });

  it("HP8: incomplete evidence rejected", () => {
    const index = new EvidenceIndex();
    const result = index.register({
      manifestId: "m1",
      sha: envelope().sha,
      artifacts: [],
      complete: false,
    });
    expect(result.ok).toBe(false);
  });

  it("HP9: snapshot verify and revoke", () => {
    const policy = new SnapshotPolicy();
    const verified = policy.verify("s1", envelope().sha, true);
    expect(verified.status).toBe("VERIFIED");
    const revoked = policy.revoke("s1", "policy change");
    expect(revoked?.status).toBe("REVOKED");
  });

  it("HP10: architecture bounds", () => {
    const projector = new ArchitectureProjector();
    const nodes = Array.from({ length: 501 }, (_, i) => ({
      id: `n${i}`,
      label: `n${i}`,
      dependsOn: [],
    }));
    const result = projector.project(envelope().sha, nodes);
    expect("error" in result).toBe(true);
  });

  it("HP11: reconciliation stale detection", () => {
    const reconciler = new Reconciler();
    const state = reconciler.reconcile({
      projectId: "proj-1",
      sha: envelope().sha,
      sourceEventCount: 2,
      projectedEventCount: 1,
      staleAfterMs: 60_000,
      lastUpdateAt: new Date(0).toISOString(),
    });
    expect(state.freshness).toBe("SOURCE_GAP");
  });
});
