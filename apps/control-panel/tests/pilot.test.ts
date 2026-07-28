import { buildResultEnvelope } from "@blueprint-harness/platform-contracts";
import { QueryApiServer } from "@blueprint-harness/platform-api";
import { PlatformClient } from "@blueprint-harness/platform-client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ControlPanelShell } from "../src/shell.js";

describe("control panel pilot (HP13-HP17)", () => {
  const sha = "e".repeat(40);
  const api = new QueryApiServer();
  let port = 0;

  beforeAll(async () => {
    const env = buildResultEnvelope({
      eventId: "evt-panel",
      eventType: "harness.check.completed",
      projectId: "proj-panel",
      repositoryId: "repo-panel",
      sha,
      run: {
        runId: "run-panel",
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
    api.ingestRaw(JSON.stringify(env), "panel-key");
    port = await api.start({ authToken: "panel-token" });
  });

  afterAll(async () => {
    await api.stop();
  });

  it("loads identical SHA state through panel shell", async () => {
    const client = new PlatformClient({
      baseUrl: `http://127.0.0.1:${port}`,
      token: "panel-token",
    });
    const shell = new ControlPanelShell(client);
    const state = await shell.loadState(`/projects/proj-panel/commits/${sha}/overview`);
    expect(state.resource.sha).toBe(sha);
    expect(state.resource.provenance).toBe("event-history-v1");
  });
});
