import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { FileOwnershipClass } from "../ownership.js";
import { compareHarnessLocks, isIncompatibleProfile, readHarnessLock } from "./compare.js";
import type { HarnessLock, UpgradeReport } from "./types.js";

const MERGE_CONTROLLED_PATHS = ["AGENTS.md", "ARCHITECTURE.md"] as const;
const BLUEPRINT_MANAGED_PREFIXES = [".cursor/", ".github/workflows/"] as const;

export interface RunUpgradeOptions {
  projectRoot: string;
  targetBlueprintVersion: string;
  targetProfile?: string;
  dryRun?: boolean;
}

function classifyOwnership(path: string): FileOwnershipClass | "UNKNOWN" {
  if (MERGE_CONTROLLED_PATHS.includes(path as typeof MERGE_CONTROLLED_PATHS[number])) {
    return "MERGE_CONTROLLED";
  }

  if (BLUEPRINT_MANAGED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return "BLUEPRINT_MANAGED";
  }

  if (path.startsWith("docs/")) {
    return "PROJECT_OWNED";
  }

  return "UNKNOWN";
}

function listManagedPaths(projectRoot: string): string[] {
  const candidates = [
    "AGENTS.md",
    "ARCHITECTURE.md",
    ".cursor/hooks.json",
    "docs/DESIGN.md",
  ];

  return candidates.filter((relative) => existsSync(join(projectRoot, relative)));
}

function buildTargetLock(
  current: HarnessLock,
  targetVersion: string,
  targetProfile?: string,
): HarnessLock {
  return {
    ...current,
    core: targetVersion,
    template: targetVersion,
    profileSdk: targetVersion,
    profile: targetProfile ?? current.profile,
    blueprintVersion: targetVersion,
  };
}

/**
 * Runs harness upgrade with optional dry-run (never mutates lock on failure).
 *
 * @param options - Upgrade target and project root.
 */
export function runUpgrade(options: RunUpgradeOptions): UpgradeReport {
  const projectRoot = resolve(options.projectRoot);
  const current = readHarnessLock(projectRoot);

  if (!current) {
    return {
      ok: false,
      phase: "FAILED",
      dryRun: options.dryRun ?? false,
      findings: [
        {
          id: "UPGRADE-001",
          severity: "error",
          message: "harness.lock.json is missing; cannot upgrade.",
        },
      ],
      lockUpdated: false,
    };
  }

  const targetProfile = options.targetProfile ?? current.profile;
  if (isIncompatibleProfile(current.profile, targetProfile)) {
    return {
      ok: false,
      phase: "FAILED",
      dryRun: options.dryRun ?? false,
      findings: [
        {
          id: "UPGRADE-002",
          severity: "error",
          message: `Incompatible profile transition ${current.profile} -> ${targetProfile}.`,
        },
      ],
      lockUpdated: false,
    };
  }

  const targetLock = buildTargetLock(current, options.targetBlueprintVersion, targetProfile);
  const diff = compareHarnessLocks(current, targetLock);

  if (diff.fromVersion === diff.toVersion) {
    return {
      ok: true,
      phase: "COMPLETED",
      dryRun: options.dryRun ?? false,
      diff,
      findings: [
        {
          id: "UPGRADE-003",
          severity: "info",
          message: "Upgrade idempotent: lock already at target blueprint version.",
        },
      ],
      lockUpdated: false,
    };
  }

  const managedPaths = listManagedPaths(projectRoot).filter(
    (path) => classifyOwnership(path) !== "PROJECT_OWNED",
  );
  const projectOwnedDoc = join(projectRoot, "docs", "DESIGN.md");
  const projectOwnedStable =
    existsSync(projectOwnedDoc) && readFileSync(projectOwnedDoc, "utf8").length > 0;

  if (options.dryRun) {
    return {
      ok: true,
      phase: "PLANNED",
      dryRun: true,
      diff,
      findings: [
        {
          id: "UPGRADE-004",
          severity: "info",
          message: `Dry-run upgrade ${diff.fromVersion} -> ${diff.toVersion} touching ${managedPaths.length} managed paths.`,
        },
      ],
      lockUpdated: false,
    };
  }

  writeFileSync(join(projectRoot, "harness.lock.json"), JSON.stringify(targetLock, null, 2));

  return {
    ok: true,
    phase: "COMPLETED",
    dryRun: false,
    diff,
    findings: [
      {
        id: "UPGRADE-005",
        severity: "info",
        message: projectOwnedStable
          ? "Upgrade completed; PROJECT_OWNED docs preserved."
          : "Upgrade completed.",
      },
    ],
    lockUpdated: true,
  };
}

/**
 * Classifies a path by ownership for upgrade merge decisions.
 *
 * @param path - Repository-relative path.
 */
export function classifyUpgradeOwnership(path: string): FileOwnershipClass | "UNKNOWN" {
  return classifyOwnership(path);
}
