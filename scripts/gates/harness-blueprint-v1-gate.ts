import { copyFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  deployStagingArtifact,
  provisionEnvironment,
  rollbackStagingArtifact,
  runBootstrap,
  runUpgrade,
  validateDocs,
  verifyStagingDeployment,
} from "../../packages/core/dist/index.js";
import { runCheck } from "../../packages/cli/dist/index.js";

const ROOT = resolve(join(fileURLToPath(import.meta.url), "..", "..", ".."));
const REFERENCE_ROOT = join(ROOT, "fixtures", "reference-project");
const REFERENCE_DOCS = join(REFERENCE_ROOT, "docs");

function seedWorkspaceStub(target: string): void {
  writeFileSync(join(target, "pnpm-workspace.yaml"), "packages:\n  - .\n", "utf8");
}

async function mockRenderHarness(targetDir: string): Promise<string[]> {
  mkdirSync(join(targetDir, ".cursor"), { recursive: true });
  writeFileSync(join(targetDir, ".cursor/hooks.json"), "{}", "utf8");
  return [".cursor/hooks.json"];
}
const failures: string[] = [];

function fail(id: string, message: string): void {
  failures.push(`${id}: ${message}`);
}

function assertStep(id: string, ok: boolean, message: string): void {
  if (!ok) {
    fail(id, message);
  }
}

async function runGate(): Promise<number> {
  const docsResult = validateDocs(ROOT);
  assertStep("G1", docsResult.ok, "harness validate-docs failed on blueprint main");

  const referenceDocs = join(REFERENCE_DOCS);
  assertStep(
    "G2a",
    existsSync(referenceDocs) && validateDocs(REFERENCE_DOCS).ok,
    "reference-project docs validation failed",
  );

  const tempTarget = mkdtempSync(join(tmpdir(), "harness-v1-gate-"));
  try {
    const bootstrap = await runBootstrap({
      docsPath: referenceDocs,
      targetDir: tempTarget,
      skipAnchorCheck: true,
      blueprintVersion: "0.0.0",
      profileId: "typescript-node",
      renderHarness: mockRenderHarness,
    });
    assertStep("G2b", bootstrap.ok, `bootstrap failed: ${bootstrap.findings[0]?.message ?? "unknown"}`);
    seedWorkspaceStub(tempTarget);

    const checkExit = runCheck({ mode: "full", rootPath: tempTarget, format: "human" });
    assertStep("G3", checkExit === 0, "reference project harness check --full failed");

    const worktreeA = mkdtempSync(join(tmpdir(), "gate-wt-a-"));
    const worktreeB = mkdtempSync(join(tmpdir(), "gate-wt-b-"));
    try {
      process.env.HARNESS_WORKTREE_ID = "gate-a";
      const recordA = provisionEnvironment(worktreeA);
      process.env.HARNESS_WORKTREE_ID = "gate-b";
      const recordB = provisionEnvironment(worktreeB);
      assertStep(
        "G4",
        recordA.appPort !== recordB.appPort && recordA.databasePort !== recordB.databasePort,
        "two-worktree isolation ports collided",
      );
    } finally {
      delete process.env.HARNESS_WORKTREE_ID;
      rmSync(worktreeA, { recursive: true, force: true });
      rmSync(worktreeB, { recursive: true, force: true });
    }

    assertStep(
      "G5",
      existsSync(join(ROOT, "docs", "QUALITY_SCORE.md")) &&
        existsSync(join(ROOT, "docs", "exec-plans", "tech-debt-tracker.md")),
      "entropy/maintenance reference artifacts missing",
    );

    mkdirSync(join(tempTarget, "docs"), { recursive: true });
    const upgrade = runUpgrade({
      projectRoot: tempTarget,
      targetBlueprintVersion: "0.1.0",
    });
    const upgradeAgain = runUpgrade({
      projectRoot: tempTarget,
      targetBlueprintVersion: "0.1.0",
    });
    assertStep("G6", upgrade.ok && upgradeAgain.ok, "upgrade round-trip failed");

    mkdirSync(join(tempTarget, "docker"), { recursive: true });
    copyFileSync(join(ROOT, "docker", "compose.staging.yml"), join(tempTarget, "docker", "compose.staging.yml"));
    deployStagingArtifact(tempTarget, "gate-artifact-v1");
    const stagingVerify = verifyStagingDeployment(tempTarget);
    deployStagingArtifact(tempTarget, "gate-artifact-v2");
    const rollback = rollbackStagingArtifact(tempTarget);
    assertStep(
      "G7",
      stagingVerify.ok && rollback.ok,
      "release/rollback exercise failed",
    );

    const tempTarget2 = mkdtempSync(join(tmpdir(), "harness-v1-gate-2-"));
    try {
      const secondBootstrap = await runBootstrap({
        docsPath: referenceDocs,
        targetDir: tempTarget2,
        skipAnchorCheck: true,
        blueprintVersion: "0.0.0",
        profileId: "typescript-node",
        renderHarness: mockRenderHarness,
      });
      assertStep("G8", secondBootstrap.ok, "second bootstrap into fresh temp dir failed");
      seedWorkspaceStub(tempTarget2);
    } finally {
      rmSync(tempTarget2, { recursive: true, force: true });
    }
  } finally {
    rmSync(tempTarget, { recursive: true, force: true });
  }

  if (failures.length === 0) {
    console.log("HARNESS_BLUEPRINT_V1_GATE: PASS");
    return 0;
  }

  console.log("HARNESS_BLUEPRINT_V1_GATE: FAIL");
  for (const entry of failures) {
    console.log(entry);
  }
  return 1;
}

runGate()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
