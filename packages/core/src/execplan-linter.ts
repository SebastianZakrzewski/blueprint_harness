import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

import { FINDING_EXEC_MISSING_HEADING } from "./docs-finding-ids.js";
import type { Finding } from "./validation-result.js";

/** Required ExecPlan section headings from docs/PLANS.md (top-level ## sections). */
export const REQUIRED_EXECPLAN_HEADINGS: readonly string[] = [
  "Purpose / Big Picture",
  "Progress",
  "Surprises & Discoveries",
  "Decision Log",
  "Outcomes & Retrospective",
  "Context and Orientation",
  "Plan of Work",
  "Concrete Steps",
  "Validation and Acceptance",
  "Idempotence and Recovery",
  "Artifacts and Notes",
  "Interfaces and Dependencies",
];

function toPosix(path: string): string {
  return path.replace(/\\/g, "/");
}

/**
 * Extracts markdown heading titles from file content (any heading level).
 *
 * @param content - Markdown source.
 * @returns Heading titles in document order.
 */
export function extractMarkdownHeadings(content: string): string[] {
  const headings: string[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (match?.[1]) {
      headings.push(match[1].trim());
    }
  }
  return headings;
}

/**
 * Extracts top-level (##) markdown section titles from ExecPlan content.
 *
 * @param content - Markdown source.
 * @returns Top-level section titles in document order.
 */
export function extractTopLevelHeadings(content: string): string[] {
  const headings: string[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match?.[1]) {
      headings.push(match[1].trim());
    }
  }
  return headings;
}

/**
 * Lints a single ExecPlan file for required top-level headings.
 *
 * Side effects: reads file when content is not provided.
 *
 * @param filePath - Repository-relative path used in findings.
 * @param content - Optional file content (for tests).
 * @returns Findings for each missing required heading.
 */
export function lintExecPlanFile(filePath: string, content?: string): Finding[] {
  const text = content ?? readFileSync(filePath, "utf8");
  const headings = extractTopLevelHeadings(text);
  const findings: Finding[] = [];

  for (const required of REQUIRED_EXECPLAN_HEADINGS) {
    if (!headings.includes(required)) {
      findings.push({
        id: FINDING_EXEC_MISSING_HEADING,
        severity: "error",
        path: toPosix(filePath),
        message: `Missing required top-level heading: ${required}`,
        remediation: `Add a ## ${required} section per docs/PLANS.md`,
      });
    }
  }

  return findings;
}

/**
 * Lints all ExecPlan markdown files under active and completed directories.
 *
 * @param rootPath - Repository root containing docs/exec-plans/.
 * @returns Aggregated findings with repository-relative paths.
 */
export function lintExecPlans(rootPath: string): Finding[] {
  const findings: Finding[] = [];
  const execPlanDirs = ["docs/exec-plans/active", "docs/exec-plans/completed"];

  for (const dirRel of execPlanDirs) {
    const dir = join(rootPath, dirRel);
    if (!existsSync(dir)) {
      continue;
    }

    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".md")) {
        continue;
      }

      const fullPath = join(dir, entry);
      const relPath = toPosix(relative(rootPath, fullPath));
      const fileFindings = lintExecPlanFile(fullPath);

      for (const finding of fileFindings) {
        findings.push({ ...finding, path: relPath });
      }
    }
  }

  return findings;
}
