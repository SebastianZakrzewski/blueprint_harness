import {
  buildValidationResult,
  deployStagingArtifact,
  rollbackStagingArtifact,
  verifyStagingDeployment,
} from "@blueprint-harness/core";
import type {
  CapabilityResolutionProposal,
  ProfileContext,
  ProfileCheckMode,
  ProfileEnvAction,
  StackProfile,
  DeployTarget,
} from "@blueprint-harness/profile-sdk";
import { resolveCapabilities } from "@blueprint-harness/profile-sdk";

import { OMITTED_CAPABILITY_MARKERS, TYPESCRIPT_NODE_CAPABILITIES } from "./catalog.js";
import { runProfileEnvironment } from "./environment.js";
import { scaffoldCapabilities, verifyCapabilityOmission } from "./scaffold.js";

const ok = () => buildValidationResult([]);

/** Default capabilities for base-only scaffold (M9a). */
export const DEFAULT_BASE_PROPOSAL: CapabilityResolutionProposal = {
  capabilities: ["base"],
  installOrder: ["base"],
};

/** Full reference stack proposal (OD-007 through mastra). */
export const REFERENCE_STACK_PROPOSAL: CapabilityResolutionProposal = {
  capabilities: ["base", "nestjs", "database", "supabase", "mastra"],
  installOrder: ["base", "nestjs", "database", "supabase", "mastra"],
};

/**
 * Creates the typescript-node StackProfile implementation.
 *
 * @param defaultCapabilities - Capabilities used when scaffold receives empty proposal.
 * @returns StackProfile instance.
 */
export function createTypescriptNodeProfile(
  defaultCapabilities: CapabilityResolutionProposal = DEFAULT_BASE_PROPOSAL,
): StackProfile {
  return {
    id: "typescript-node",
    version: "0.0.0",

    async detect(context: ProfileContext) {
      const resolution = resolveCapabilities({
        requested: [...defaultCapabilities.capabilities],
        catalog: TYPESCRIPT_NODE_CAPABILITIES,
      });

      if (!resolution.ok) {
        return buildValidationResult(resolution.findings);
      }

      return ok();
    },

    async scaffold(context: ProfileContext, proposal: CapabilityResolutionProposal) {
      const activeProposal =
        proposal.capabilities.length > 0 ? proposal : defaultCapabilities;
      const { written, result } = scaffoldCapabilities(context.projectRoot, activeProposal);

      if (!result.ok) {
        return result;
      }

      const omission = verifyCapabilityOmission(
        context.projectRoot,
        activeProposal.capabilities,
        OMITTED_CAPABILITY_MARKERS,
      );

      if (!omission.ok) {
        return omission;
      }

      return buildValidationResult([
        {
          id: "PROFILE-003",
          severity: "info",
          message: `Scaffolded ${written.length} base files for typescript-node.`,
        },
      ]);
    },

    async check(_context: ProfileContext, _mode: ProfileCheckMode) {
      return ok();
    },

    async env(context: ProfileContext, action: ProfileEnvAction) {
      return runProfileEnvironment(context, action);
    },

    async arch(_context: ProfileContext) {
      return ok();
    },

    async build(_context: ProfileContext) {
      return ok();
    },

    async deploy(context: ProfileContext, target: DeployTarget) {
      if (target !== "staging") {
        return buildValidationResult([
          {
            id: "RELEASE-006",
            severity: "error",
            message: `Deploy target "${target}" is not supported in V1 profile stub.`,
          },
        ]);
      }

      deployStagingArtifact(context.projectRoot, `staging-build:${context.projectRoot}`);
      return verifyStagingDeployment(context.projectRoot);
    },

    async rollback(context: ProfileContext, target: DeployTarget) {
      if (target !== "staging") {
        return buildValidationResult([
          {
            id: "RELEASE-006",
            severity: "error",
            message: `Rollback target "${target}" is not supported in V1 profile stub.`,
          },
        ]);
      }

      return rollbackStagingArtifact(context.projectRoot);
    },
  };
}

/** Default exported profile instance. */
export const typescriptNodeProfile = createTypescriptNodeProfile();
