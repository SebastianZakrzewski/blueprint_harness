import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildResultEnvelope } from "../../packages/platform-contracts/dist/index.js";
import { QueryApiServer } from "../../apps/platform-api/dist/query-api.js";

const ROOT = resolve(join(fileURLToPath(import.meta.url), "..", "..", ".."));
const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

async function main(): Promise<number> {
  const sha = "d".repeat(40);
  const env = buildResultEnvelope({
    eventId: "evt-gate",
    eventType: "harness.check.completed",
    projectId: "proj-gate",
    repositoryId: "repo-gate",
    sha,
    run: {
      runId: "run-gate",
      attempt: 1,
      trigger: "ci",
      startedAt: "2026-07-28T00:00:00.000Z",
    },
    producer: { type: "cli", id: "cli", version: "1" },
    criteriaIds: ["PLATFORM-AC-029"],
    findings: [],
    artifactReferences: [],
    observedAt: "2026-07-28T00:00:01.000Z",
  });

  const api = new QueryApiServer();
  api.ingestRaw(JSON.stringify(env), "gate-key");
  const port = await api.start({ authToken: "gate-token" });

  const response = await fetch(
    `http://127.0.0.1:${port}/v1/projects/proj-gate/commits/${sha}`,
    { headers: { authorization: "Bearer gate-token" } },
  );

  if (!response.ok) {
    fail(`Query API returned ${response.status}`);
  }

  const body = (await response.json()) as { sha?: string };
  if (body.sha !== sha) {
    fail("Query API did not return requested SHA");
  }

  await api.stop();

  const evidenceDir = join(ROOT, "artifacts", "gates");
  writeFileSync(
    join(evidenceDir, "platform-query-api-ready.json"),
    JSON.stringify({ ok: failures.length === 0, sha, port }, null, 2),
    "utf8",
  );

  if (failures.length > 0) {
    console.log("PLATFORM_QUERY_API_READY: FAIL");
    for (const failure of failures) {
      console.log(failure);
    }
    return 1;
  }

  console.log("PLATFORM_QUERY_API_READY: PASS");
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
