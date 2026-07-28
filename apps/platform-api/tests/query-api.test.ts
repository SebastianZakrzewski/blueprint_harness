import { buildResultEnvelope } from "@blueprint-harness/platform-contracts";
import { describe, expect, it } from "vitest";

import { QueryApiServer } from "../src/query-api.js";

describe("platform Query API (HP12)", () => {
  it("returns exact SHA resource with auth and freshness metadata", async () => {
    const api = new QueryApiServer();
    const sha = "c".repeat(40);
    const env = buildResultEnvelope({
      eventId: "evt-api",
      eventType: "harness.check.completed",
      projectId: "proj-api",
      repositoryId: "repo-api",
      sha,
      run: {
        runId: "run-api",
        attempt: 1,
        trigger: "ci",
        startedAt: "2026-07-28T00:00:00.000Z",
      },
      producer: { type: "cli", id: "cli", version: "1" },
      criteriaIds: [],
      findings: [],
      artifactReferences: [],
      observedAt: "2026-07-28T00:00:01.000Z",
    });
    api.ingestRaw(JSON.stringify(env), "key-api");

    const port = await api.start({ authToken: "test-token" });
    const response = await fetch(
      `http://127.0.0.1:${port}/v1/projects/proj-api/commits/${sha}`,
      { headers: { authorization: "Bearer test-token" } },
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("x-exact-sha")).toBe(sha);
    const body = (await response.json()) as { sha: string; provenance: string };
    expect(body.sha).toBe(sha);
    expect(body.provenance).toBe("event-history-v1");
    await api.stop();
  });
});
