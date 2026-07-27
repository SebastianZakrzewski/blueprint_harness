/**
 * Capability declaration schema for stack profiles.
 */

/** Declares install order, dependencies, and incompatibility for one capability. */
export interface CapabilityDefinition {
  /** Stable capability identifier (e.g. `base`, `nestjs`). */
  id: string;
  /** Capability ids that must be installed before this one. */
  dependsOn: readonly string[];
  /** Capability ids that cannot coexist with this one. */
  incompatibleWith: readonly string[];
  /** Accepted Universal Core semver range. */
  requiredCoreRange?: string;
  /** Accepted profile SDK semver range. */
  requiredProfileSdkRange?: string;
  /** Monotonic install order hint (lower installs first). */
  installOrder: number;
  /** Commands this capability registers with the harness CLI. */
  providedCommands?: readonly string[];
  /** Structural fixture paths expected after scaffold. */
  expectedStructuralFixtures?: readonly string[];
}
