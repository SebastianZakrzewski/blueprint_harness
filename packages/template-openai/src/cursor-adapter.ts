import type { ManifestEntry } from "./types.js";

/** Cursor adapter surfaces from ARCHITECTURE.md (M4). */
export const CURSOR_ADAPTER_ENTRIES: readonly ManifestEntry[] = [
  { path: ".cursor/rules", kind: "directory", ownershipClass: "BLUEPRINT_MANAGED" },
  {
    path: ".cursor/rules/harness-entry.mdc",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".cursor/rules/harness-entry.mdc",
  },
  { path: ".cursor/skills", kind: "directory", ownershipClass: "BLUEPRINT_MANAGED" },
  { path: ".cursor/skills/task-loop", kind: "directory", ownershipClass: "BLUEPRINT_MANAGED" },
  {
    path: ".cursor/skills/task-loop/SKILL.md",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".cursor/skills/task-loop/SKILL.md",
  },
  { path: ".cursor/agents", kind: "directory", ownershipClass: "BLUEPRINT_MANAGED" },
  {
    path: ".cursor/agents/independent-reviewer.md",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".cursor/agents/independent-reviewer.md",
  },
  {
    path: ".cursor/hooks.json",
    kind: "file",
    ownershipClass: "BLUEPRINT_MANAGED",
    templatePath: ".cursor/hooks.json",
  },
];

/** Cursor surface paths required by M4-AC1. */
export const CURSOR_SURFACE_PATHS: readonly string[] = [
  ".cursor/rules/",
  ".cursor/skills/",
  ".cursor/agents/",
  ".cursor/hooks.json",
];
