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
export { DATABASE_SCAFFOLD_PATHS, scaffoldDatabase } from "./capabilities/database.js";
export { NESTJS_SCAFFOLD_PATHS, scaffoldNestjs } from "./capabilities/nestjs.js";

export {
  scaffoldCapabilities,
  verifyCapabilityOmission,
} from "./scaffold.js";

export { runProfileEnvironment } from "./environment.js";
export { runArchLints } from "./lint/arch-lints.js";
export { runStructuralHarnessChecks } from "./structural/harness-files.js";

export {
  createTypescriptNodeProfile,
  DEFAULT_BASE_PROPOSAL,
  REFERENCE_STACK_PROPOSAL,
  typescriptNodeProfile,
} from "./profile.js";
