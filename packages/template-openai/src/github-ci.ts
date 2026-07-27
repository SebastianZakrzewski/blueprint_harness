import type { ManifestEntry } from "./types.js";

/** GitHub CI workflow templates for generated projects (M12). */
export const GITHUB_CI_ENTRIES: readonly ManifestEntry[] = [
  { path: ".github/workflows", kind: "directory", ownershipClass: "BLUEPRINT_MANAGED" },
  {
    path: ".github/workflows/ci.yml",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".github/workflows/ci.yml",
  },
  {
    path: ".github/workflows/pr-gate.yml",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".github/workflows/pr-gate.yml",
  },
];

/** Workflow paths required by M12-AC5. */
export const GITHUB_CI_PATHS: readonly string[] = [
  ".github/workflows/ci.yml",
  ".github/workflows/pr-gate.yml",
];
