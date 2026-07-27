import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { HarnessLock, UpgradeDiff } from "./types.js";

/**
 * Reads harness.lock.json from a project root.
 *
 * @param projectRoot - Project root containing harness.lock.json.
 */
export function readHarnessLock(projectRoot: string): HarnessLock | undefined {
  const path = join(resolve(projectRoot), "harness.lock.json");
  if (!existsSync(path)) {
    return undefined;
  }

  return JSON.parse(readFileSync(path, "utf8")) as HarnessLock;
}

/**
 * Compares installed lock with a target blueprint lock.
 *
 * @param current - Installed lock.
 * @param target - Target lock after upgrade.
 */
export function compareHarnessLocks(current: HarnessLock, target: HarnessLock): UpgradeDiff {
  const added = target.capabilities.filter((cap) => !current.capabilities.includes(cap));
  const removed = current.capabilities.filter((cap) => !target.capabilities.includes(cap));

  return {
    fromVersion: current.blueprintVersion,
    toVersion: target.blueprintVersion,
    profileChanged: current.profile !== target.profile,
    capabilityChanges: { added, removed },
    requiresMerge: current.blueprintVersion !== target.blueprintVersion,
  };
}

/**
 * Returns true when profile ids are incompatible for upgrade.
 *
 * @param currentProfile - Installed profile id.
 * @param targetProfile - Requested profile id.
 */
export function isIncompatibleProfile(currentProfile: string, targetProfile: string): boolean {
  return currentProfile !== targetProfile;
}
