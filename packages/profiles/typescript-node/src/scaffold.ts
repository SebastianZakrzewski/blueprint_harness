import { existsSync } from "node:fs";
import { join } from "node:path";

import { buildValidationResult, type Finding } from "@blueprint-harness/core";
import type { CapabilityResolutionProposal } from "@blueprint-harness/profile-sdk";

import { scaffoldBase } from "./capabilities/base.js";

/** Capability scaffold handlers keyed by capability id. */
const CAPABILITY_SCAFFOLDERS: Record<string, (projectRoot: string) => string[]> = {
  base: scaffoldBase,
};

/**
 * Runs capability scaffolds in install order for the resolved proposal.
 *
 * @param projectRoot - Target project root.
 * @param proposal - Resolved capabilities from profile-sdk.
 * @returns Written relative paths and validation result.
 */
export function scaffoldCapabilities(
  projectRoot: string,
  proposal: CapabilityResolutionProposal,
): { written: string[]; result: ReturnType<typeof buildValidationResult> } {
  const written: string[] = [];

  for (const capabilityId of proposal.installOrder) {
    const scaffold = CAPABILITY_SCAFFOLDERS[capabilityId];
    if (!scaffold) {
      return {
        written,
        result: buildValidationResult([
          {
            id: "PROFILE-001",
            severity: "error",
            message: `No scaffold registered for capability "${capabilityId}".`,
          },
        ]),
      };
    }

    written.push(...scaffold(projectRoot));
  }

  return { written, result: buildValidationResult([]) };
}

/**
 * Returns true when omitted-capability marker paths are absent.
 *
 * @param projectRoot - Scaffolded project root.
 * @param enabledCapabilities - Installed capability ids.
 * @param markers - Map of capability id to paths that must not exist when omitted.
 */
export function verifyCapabilityOmission(
  projectRoot: string,
  enabledCapabilities: readonly string[],
  markers: Record<string, readonly string[]>,
): ReturnType<typeof buildValidationResult> {
  const findings: Finding[] = [];

  for (const [capabilityId, paths] of Object.entries(markers)) {
    if (enabledCapabilities.includes(capabilityId)) {
      continue;
    }

    for (const relativePath of paths) {
      if (existsSync(join(projectRoot, relativePath))) {
        findings.push({
          id: "PROFILE-002",
          severity: "error",
          path: relativePath,
          message: `Omitted capability "${capabilityId}" produced file "${relativePath}".`,
        });
      }
    }
  }

  return buildValidationResult(findings);
}
