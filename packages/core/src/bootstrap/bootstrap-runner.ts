import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { recordCheckpoint } from "../checkpoint.js";
import { HUMAN_JUDGMENT_REQUIRED } from "../docs-ingestion/finding-ids.js";
import { ingestDocs, validateIngestionResult } from "../docs-ingestion/validate.js";
import type { BootstrapState } from "../lifecycle.js";
import { BOOTSTRAP_STATE_ORDER } from "../lifecycle.js";
import { validateDocs } from "../validate-docs.js";
import { buildValidationResult, type Finding } from "../validation-result.js";
import { loadCheckpoints, saveCheckpoint } from "./checkpoint-store.js";

export interface HarnessRenderContext {
  projectName: string;
  profileId: string;
  blueprintVersion: string;
}

export type HarnessRenderFn = (
  targetDir: string,
  context: HarnessRenderContext,
) => Promise<string[]> | string[];

export interface BootstrapOptions {
  docsPath: string;
  targetDir: string;
  projectName?: string;
  profileId?: string;
  blueprintVersion?: string;
  /** When true, skip overwriting existing project-owned docs (Blueprint self-apply). */
  selfApply?: boolean;
  /** Skip anchor-commit verification (for fixture tests). */
  skipAnchorCheck?: boolean;
  /** Injected template render hook (provided by CLI). */
  renderHarness?: HarnessRenderFn;
  /** Injected profile scaffold hook (M9 — SCAFFOLD_GENERATED). */
  scaffoldProfile?: ScaffoldProfileFn;
}

export type ScaffoldProfileFn = (
  targetDir: string,
) => Promise<{ ok: boolean; findings: Finding[]; written?: string[] }>;

export interface BootstrapResult {
  ok: boolean;
  state: BootstrapState;
  checkpoints: ReturnType<typeof loadCheckpoints>;
  findings: Finding[];
  writtenFiles: string[];
}

function checksumString(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hasGitAnchor(targetDir: string): boolean {
  return existsSync(join(targetDir, ".git"));
}

function copyDirectoryContents(source: string, destination: string): void {
  cpSync(source, destination, { recursive: true });
}

function writeHarnessConfig(targetDir: string, profileId: string, blueprintVersion: string): void {
  const content = `export default {\n  profileId: "${profileId}",\n  blueprintVersion: "${blueprintVersion}",\n};\n`;
  writeFileSync(join(targetDir, "harness.config.ts"), content, "utf8");
}

function writeHarnessLock(targetDir: string, profileId: string, blueprintVersion: string): void {
  const lock = {
    core: blueprintVersion,
    template: blueprintVersion,
    profileSdk: blueprintVersion,
    profile: profileId,
    capabilities: ["base"],
    blueprintVersion,
  };
  writeFileSync(join(targetDir, "harness.lock.json"), JSON.stringify(lock, null, 2), "utf8");
}

async function renderHarnessTemplate(
  targetDir: string,
  options: BootstrapOptions,
): Promise<string[]> {
  if (!options.renderHarness) {
    return [];
  }

  const context: HarnessRenderContext = {
    projectName: options.projectName ?? "project",
    profileId: options.profileId ?? "typescript-node",
    blueprintVersion: options.blueprintVersion ?? "0.0.0",
  };

  const rendered = await options.renderHarness(targetDir, context);
  return rendered;
}

function completedStates(checkpoints: ReturnType<typeof loadCheckpoints>): BootstrapState[] {
  return checkpoints
    .map((checkpoint) => checkpoint.state)
    .filter((state): state is BootstrapState =>
      BOOTSTRAP_STATE_ORDER.includes(state as BootstrapState),
    );
}

function needsStep(completed: BootstrapState[], step: BootstrapState): boolean {
  return !completed.includes(step);
}

/**
 * Runs bootstrap through DISCOVERED → HARNESS_INSTALLED with checkpoint resume.
 *
 * @param options - Docs source, target directory, and render options.
 * @returns Bootstrap outcome with state and findings.
 */
export async function runBootstrap(options: BootstrapOptions): Promise<BootstrapResult> {
  const targetDir = resolve(options.targetDir);
  const docsPath = resolve(options.docsPath);
  const writtenFiles: string[] = [];
  let checkpoints = loadCheckpoints(targetDir);
  const completed = completedStates(checkpoints);

  if (completed.includes("SCAFFOLD_GENERATED")) {
    return {
      ok: true,
      state: "SCAFFOLD_GENERATED",
      checkpoints,
      findings: [],
      writtenFiles,
    };
  }

  if (completed.includes("HARNESS_INSTALLED") && !options.scaffoldProfile) {
    return {
      ok: true,
      state: "HARNESS_INSTALLED",
      checkpoints,
      findings: [],
      writtenFiles,
    };
  }

  if (!options.skipAnchorCheck && !hasGitAnchor(targetDir)) {
    return {
      ok: false,
      state: completed.at(-1) ?? "DISCOVERED",
      checkpoints,
      findings: [
        {
          id: "BOOTSTRAP-001",
          severity: "error",
          message: "Anchor commit required: target must be a git repository.",
          remediation:
            "Initialize git and create an anchor commit on main before bootstrap.",
        },
      ],
      writtenFiles,
    };
  }

  if (needsStep(completed, "DISCOVERED")) {
    const ingestion = ingestDocs(docsPath);
    if (ingestion.humanJudgmentRequired) {
      return {
        ok: false,
        state: "DISCOVERED",
        checkpoints,
        findings: ingestion.findings,
        writtenFiles,
      };
    }

    const ingestionValidation = validateIngestionResult(ingestion);
    if (!ingestionValidation.ok) {
      return {
        ok: false,
        state: "DISCOVERED",
        checkpoints,
        findings: ingestionValidation.findings,
        writtenFiles,
      };
    }

    saveCheckpoint(
      targetDir,
      recordCheckpoint("DISCOVERED", {
        inputsChecksum: checksumString(docsPath),
        outputsChecksum: checksumString(JSON.stringify(ingestion.inventory)),
      }),
    );
    checkpoints = loadCheckpoints(targetDir);
  }

  if (needsStep(completedStates(checkpoints), "DOCS_MAPPED")) {
    if (!options.selfApply) {
      mkdirSync(targetDir, { recursive: true });
      copyDirectoryContents(docsPath, targetDir);
      writtenFiles.push("docs-import");
    }

    saveCheckpoint(
      targetDir,
      recordCheckpoint("DOCS_MAPPED", {
        inputsChecksum: checksumString(docsPath),
        outputsChecksum: checksumString("docs-copied"),
      }),
    );
    checkpoints = loadCheckpoints(targetDir);
  }

  if (needsStep(completedStates(checkpoints), "DOCS_VALIDATED")) {
    const docsValidation = validateDocs(targetDir);
    if (!docsValidation.ok && !options.selfApply) {
      return {
        ok: false,
        state: "DOCS_MAPPED",
        checkpoints,
        findings: docsValidation.findings,
        writtenFiles,
      };
    }

    saveCheckpoint(
      targetDir,
      recordCheckpoint("DOCS_VALIDATED", {
        inputsChecksum: checksumString(targetDir),
        outputsChecksum: checksumString(JSON.stringify(docsValidation.findings)),
      }),
    );
    checkpoints = loadCheckpoints(targetDir);
  }

  if (needsStep(completedStates(checkpoints), "HARNESS_INSTALLED")) {
    const profileId = options.profileId ?? "typescript-node";
    const blueprintVersion = options.blueprintVersion ?? "0.0.0";

    const rendered = await renderHarnessTemplate(targetDir, options);
    writtenFiles.push(...rendered);

    writeHarnessConfig(targetDir, profileId, blueprintVersion);
    writeHarnessLock(targetDir, profileId, blueprintVersion);
    writtenFiles.push("harness.config.ts", "harness.lock.json");

    saveCheckpoint(
      targetDir,
      recordCheckpoint("HARNESS_INSTALLED", {
        inputsChecksum: checksumString(profileId),
        outputsChecksum: checksumString(rendered.join(",")),
      }),
    );
    checkpoints = loadCheckpoints(targetDir);
  }

  if (needsStep(completedStates(checkpoints), "SCAFFOLD_GENERATED") && options.scaffoldProfile) {
    const scaffoldResult = await options.scaffoldProfile(targetDir);
    if (!scaffoldResult.ok) {
      return {
        ok: false,
        state: "HARNESS_INSTALLED",
        checkpoints,
        findings: scaffoldResult.findings,
        writtenFiles,
      };
    }

    if (scaffoldResult.written) {
      writtenFiles.push(...scaffoldResult.written);
    }

    saveCheckpoint(
      targetDir,
      recordCheckpoint("SCAFFOLD_GENERATED", {
        inputsChecksum: checksumString(targetDir),
        outputsChecksum: checksumString(scaffoldResult.written?.join(",") ?? "scaffold"),
      }),
    );
    checkpoints = loadCheckpoints(targetDir);
  }

  const finalState = completedStates(checkpoints).includes("SCAFFOLD_GENERATED")
    ? "SCAFFOLD_GENERATED"
    : "HARNESS_INSTALLED";

  return {
    ok: true,
    state: finalState,
    checkpoints,
    findings: [],
    writtenFiles,
  };
}
