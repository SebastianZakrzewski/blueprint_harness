import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(join(fileURLToPath(import.meta.url), "..", "..", ".."));
const failures: string[] = [];

function run(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, { cwd: ROOT, shell: true, encoding: "utf8" });
  if (result.status !== 0) {
    failures.push(`${command} ${args.join(" ")} failed`);
    return false;
  }
  return true;
}

async function main(): Promise<number> {
  run("pnpm", ["exec", "harness", "check", "--full"]);
  run("pnpm", ["run", "gate"]);
  run("pnpm", ["run", "gate:platform-query-api"]);
  run("pnpm", ["run", "gate:control-panel-pilot"]);

  const evidenceDir = join(ROOT, "artifacts", "gates");
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(
    join(evidenceDir, "harness-platform-v1-1-gate.json"),
    JSON.stringify({ ok: failures.length === 0 }, null, 2),
    "utf8",
  );

  if (failures.length > 0) {
    console.log("HARNESS_PLATFORM_V1_1_GATE: FAIL");
    return 1;
  }
  console.log("HARNESS_PLATFORM_V1_1_GATE: PASS");
  return 0;
}

main().then((code) => {
  process.exitCode = code;
});
