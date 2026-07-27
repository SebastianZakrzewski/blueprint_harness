/** Package identity for the TypeScript/Node stack profile. */
export const packageIdentity = {
  name: "@blueprint-harness/profiles-typescript-node",
  version: "0.0.0",
} as const;

export {
  OMITTED_CAPABILITY_MARKERS,
  TYPESCRIPT_NODE_CAPABILITIES,
} from "./catalog.js";

export { BASE_SCAFFOLD_PATHS, scaffoldBase } from "./capabilities/base.js";

export {
  scaffoldCapabilities,
  verifyCapabilityOmission,
} from "./scaffold.js";

export {
  createTypescriptNodeProfile,
  DEFAULT_BASE_PROPOSAL,
  typescriptNodeProfile,
} from "./profile.js";
