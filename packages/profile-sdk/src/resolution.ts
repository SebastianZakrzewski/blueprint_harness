/**
 * Capability resolution — fails before mutation when the set is incompatible.
 */

import { buildValidationResult, type Finding } from "@blueprint-harness/core";

import {
  FINDING_CAPABILITY_INCOMPATIBLE,
  FINDING_CAPABILITY_MISSING_DEPENDENCY,
  FINDING_CAPABILITY_UNKNOWN,
} from "./capability-finding-ids.js";
import type { CapabilityDefinition } from "./capability.js";
import type { CapabilityResolutionProposal } from "./contract.js";

export interface ResolveCapabilitiesInput {
  /** Capability ids requested for installation. */
  requested: readonly string[];
  /** Full capability catalog for the profile. */
  catalog: readonly CapabilityDefinition[];
}

export interface ResolveCapabilitiesSuccess {
  ok: true;
  proposal: CapabilityResolutionProposal;
}

export interface ResolveCapabilitiesFailure {
  ok: false;
  findings: Finding[];
}

export type ResolveCapabilitiesResult =
  | ResolveCapabilitiesSuccess
  | ResolveCapabilitiesFailure;

function buildCatalogMap(
  catalog: readonly CapabilityDefinition[],
): Map<string, CapabilityDefinition> {
  return new Map(catalog.map((entry) => [entry.id, entry]));
}

function sortByInstallOrder(
  ids: readonly string[],
  catalogMap: Map<string, CapabilityDefinition>,
): string[] {
  return [...ids].sort(
    (left, right) =>
      catalogMap.get(left)!.installOrder - catalogMap.get(right)!.installOrder,
  );
}

/**
 * Resolves requested capabilities against a catalog without mutating the project.
 *
 * Fails before install when ids are unknown, dependencies are missing, or
 * incompatible pairs are selected. Returns install order on success.
 *
 * @param input - Requested ids and profile capability catalog.
 * @returns Success proposal or blocking findings.
 */
export function resolveCapabilities(
  input: ResolveCapabilitiesInput,
): ResolveCapabilitiesResult {
  const findings: Finding[] = [];
  const catalogMap = buildCatalogMap(input.catalog);
  const selected = new Set(input.requested);

  for (const id of input.requested) {
    if (!catalogMap.has(id)) {
      findings.push({
        id: FINDING_CAPABILITY_UNKNOWN,
        severity: "error",
        message: `Capability "${id}" is not registered in the profile catalog.`,
        remediation: "Select capabilities from the profile catalog or update the catalog.",
      });
    }
  }

  if (findings.length > 0) {
    return { ok: false, findings };
  }

  for (const id of input.requested) {
    const definition = catalogMap.get(id)!;

    for (const dependency of definition.dependsOn) {
      if (!selected.has(dependency)) {
        findings.push({
          id: FINDING_CAPABILITY_MISSING_DEPENDENCY,
          severity: "error",
          message: `Capability "${id}" requires "${dependency}" but it was not selected.`,
          remediation: `Add "${dependency}" to the requested capability set.`,
        });
      }
    }

    for (const incompatible of definition.incompatibleWith) {
      if (selected.has(incompatible)) {
        findings.push({
          id: FINDING_CAPABILITY_INCOMPATIBLE,
          severity: "error",
          message: `Capability "${id}" is incompatible with "${incompatible}".`,
          remediation: `Remove either "${id}" or "${incompatible}" before install.`,
        });
      }
    }
  }

  if (findings.length > 0) {
    return { ok: false, findings };
  }

  const installOrder = sortByInstallOrder(input.requested, catalogMap);

  return {
    ok: true,
    proposal: {
      capabilities: installOrder,
      installOrder,
    },
  };
}

/**
 * Convenience wrapper returning Core ValidationResult shape on failure only.
 *
 * @param input - Requested ids and profile capability catalog.
 * @returns ValidationResult when resolution fails; undefined on success.
 */
export function resolveCapabilitiesOrFindings(
  input: ResolveCapabilitiesInput,
): ResolveCapabilitiesResult {
  return resolveCapabilities(input);
}

/**
 * Maps a failed resolution to a Core ValidationResult for CLI output.
 *
 * @param failure - Failed resolution with findings.
 * @returns ValidationResult with ok=false.
 */
export function resolutionFailureToValidationResult(
  failure: ResolveCapabilitiesFailure,
): ReturnType<typeof buildValidationResult> {
  return buildValidationResult(failure.findings);
}
