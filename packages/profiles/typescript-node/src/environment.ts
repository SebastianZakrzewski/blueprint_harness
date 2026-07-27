import {
  buildValidationResult,
  cleanupEnvironment,
  getEnvironmentStatus,
  provisionEnvironment,
} from "@blueprint-harness/core";
import type { ProfileContext, ProfileEnvAction } from "@blueprint-harness/profile-sdk";

/**
 * Profile-level environment operations delegating to Core environment module.
 *
 * @param context - Profile runtime context.
 * @param action - Environment lifecycle action.
 * @returns Validation result for the action.
 */
export function runProfileEnvironment(
  context: ProfileContext,
  action: ProfileEnvAction,
): ReturnType<typeof buildValidationResult> {
  if (action === "up") {
    provisionEnvironment(context.projectRoot);
    return buildValidationResult([]);
  }

  if (action === "down") {
    cleanupEnvironment(context.projectRoot);
    return buildValidationResult([]);
  }

  const status = getEnvironmentStatus(context.projectRoot);
  return buildValidationResult([
    {
      id: "ENV-001",
      severity: "info",
      message: `Environment status: ${status.health} (worktree=${status.worktreeId})`,
    },
  ]);
}
