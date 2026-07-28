import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildResultEnvelope } from "../../packages/platform-contracts/dist/index.js";
import { QueryApiServer } from "../../apps/platform-api/dist/query-api.js";
import { PlatformClient } from "../../packages/platform-client/dist/client.js";
import { ControlPanelShell } from "../../apps/control-panel/dist/shell.js";

const ROOT = resolve(join(fileURLToPath(import.meta.url), "..", "..", ".."));
const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

async function main(): Promise<number> {
  const sha = "f".repeat(40);
  const env = buildResultEnvelope({
    eventId: "evt-pilot",
    eventType: "harness.check.completed",
    projectId: "proj-pilot",
    repositoryId: "repo-pilot",
    sha,
    run: {
      runId: "run-pilot",
      attempt: 1,
      trigger: "ci",
      startedAt: "2026-07-28T00:00:00.000Z",
    },
    producer: { type: "cli", id: "cli", version: "1" },
    criteriaIds: ["PANEL-AC-001"],
    findings: [],
    artifactReferences: [],
    observedAt: "2026-07-28T00:00:01.000Z",
  });

  const api = new QueryApiServer();
  api.ingestRaw(JSON.stringify(env), "pilot-key");
  const port = await api.start({ authToken: "pilot-token" });

  const client = new PlatformClient({
    baseUrl: `http://127.0.0.1:${port}`,
    token: "pilot-token",
  });
  const shell = new ControlPanelShell(client);
  const state = await shell.loadState(`/projects/proj-pilot/commits/${sha}/overview`);
  if (state.resource.sha !== sha) {
    fail("Panel state SHA mismatch");
  }

  await api.stop();

  const evidenceDir = join(ROOT, "artifacts", "gates");
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(
    join(evidenceDir, "control-panel-pilot-ready.json"),
    JSON.stringify({ ok: failures.length === 0, sha }, null, 2),
    "utf8",
  );

  if (failures.length > 0) {
    console.log("CONTROL_PANEL_PILOT_READY: FAIL");
    return 1;
  }
  console.log("CONTROL_PANEL_PILOT_READY: PASS");
  return 0;
}

main().then((code) => {
  process.exitCode = code;
});
