/**
 * StackProfile contract — required profile operations from blueprint-architecture.
 */

import type { ValidationResult } from "@blueprint-harness/core";

/** Runtime context passed to every profile operation. */
export interface ProfileContext {
  /** Absolute path to the target project root. */
  projectRoot: string;
  /** Resolved stack profile identifier. */
  profileId: string;
}

/** Ordered capability set produced by resolution before scaffold/install. */
export interface CapabilityResolutionProposal {
  /** Selected capability ids in install order. */
  capabilities: readonly string[];
  /** Same ids sorted by catalog installOrder (redundant but explicit for lock files). */
  installOrder: readonly string[];
}

/** Check mode delegated from harness check --fast | --full. */
export type ProfileCheckMode = "fast" | "full";

/** Deployment target for profile deploy and rollback operations. */
export type DeployTarget = "staging" | "production";

/** Environment lifecycle action for profile env operations. */
export type ProfileEnvAction = "up" | "down" | "status";

/**
 * Stack profile contract implemented by every profile package.
 *
 * Operations mirror blueprint-architecture: detection, scaffold, checks,
 * environment startup, architecture validation, build, deployment, and rollback.
 */
export interface StackProfile {
  readonly id: string;
  readonly version: string;

  /**
   * Detects whether the profile applies to the project and required capabilities.
   *
   * @param context - Target project context.
   * @returns Validation result; errors block bootstrap.
   */
  detect(context: ProfileContext): Promise<ValidationResult>;

  /**
   * Scaffolds profile files for the resolved capability proposal.
   *
   * @param context - Target project context.
   * @param proposal - Resolved capabilities from `resolveCapabilities`.
   * @returns Validation result; errors block mutation completion.
   */
  scaffold(
    context: ProfileContext,
    proposal: CapabilityResolutionProposal,
  ): Promise<ValidationResult>;

  /**
   * Runs profile checks (fast or full).
   *
   * @param context - Target project context.
   * @param mode - Fast or full check scope.
   * @returns Aggregated validation result.
   */
  check(context: ProfileContext, mode: ProfileCheckMode): Promise<ValidationResult>;

  /**
   * Starts, stops, or reports isolated environment state.
   *
   * @param context - Target project context.
   * @param action - Environment lifecycle action.
   * @returns Validation result for the action outcome.
   */
  env(context: ProfileContext, action: ProfileEnvAction): Promise<ValidationResult>;

  /**
   * Validates architecture rules for the enabled capability set.
   *
   * @param context - Target project context.
   * @returns Validation result with structural or layer violations.
   */
  arch(context: ProfileContext): Promise<ValidationResult>;

  /**
   * Builds deployable artifacts for the project.
   *
   * @param context - Target project context.
   * @returns Validation result; errors indicate build failure.
   */
  build(context: ProfileContext): Promise<ValidationResult>;

  /**
   * Deploys to staging or production.
   *
   * @param context - Target project context.
   * @param target - Deployment environment.
   * @returns Validation result for deploy outcome.
   */
  deploy(context: ProfileContext, target: DeployTarget): Promise<ValidationResult>;

  /**
   * Rolls back staging or production to the previous known good state.
   *
   * @param context - Target project context.
   * @param target - Deployment environment to roll back.
   * @returns Validation result for rollback outcome.
   */
  rollback(context: ProfileContext, target: DeployTarget): Promise<ValidationResult>;
}
