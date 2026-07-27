/** Package identity for the Profile SDK package. */
export const packageIdentity = {
  name: "@blueprint-harness/profile-sdk",
  version: "0.0.0",
} as const;

export {
  FINDING_CAPABILITY_INCOMPATIBLE,
  FINDING_CAPABILITY_MISSING_DEPENDENCY,
  FINDING_CAPABILITY_UNKNOWN,
} from "./capability-finding-ids.js";

export type { CapabilityDefinition } from "./capability.js";

export type {
  CapabilityResolutionProposal,
  DeployTarget,
  ProfileCheckMode,
  ProfileContext,
  ProfileEnvAction,
  StackProfile,
} from "./contract.js";

export {
  resolutionFailureToValidationResult,
  resolveCapabilities,
  resolveCapabilitiesOrFindings,
  type ResolveCapabilitiesFailure,
  type ResolveCapabilitiesInput,
  type ResolveCapabilitiesResult,
  type ResolveCapabilitiesSuccess,
} from "./resolution.js";
