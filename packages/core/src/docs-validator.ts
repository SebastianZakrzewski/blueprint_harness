import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

import type { Finding } from "./validation-result.js";

/** Required files from harness-blueprint knowledge layout. */
const REQUIRED_FILES: readonly string[] = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "docs/exec-plans/tech-debt-tracker.md",
  "docs/generated/db-schema.md",
  "docs/DESIGN.md",
  "docs/FRONTEND.md",
  "docs/PLANS.md",
  "docs/PRODUCT_SENSE.md",
  "docs/QUALITY_SCORE.md",
  "docs/RELIABILITY.md",
  "docs/SECURITY.md",
];

/** Required directories from harness-blueprint knowledge layout. */
const REQUIRED_DIRS: readonly string[] = [
  "docs/design-docs",
  "docs/exec-plans/active",
  "docs/exec-plans/completed",
  "docs/product-specs",
  "docs/references",
];

const INDEX_FILES: readonly string[] = [
  "docs/product-specs/index.md",
  "docs/design-docs/index.md",
];

const STATUS_HEADER_PATTERN = /^Status:\s+.+/;

function toPosix(path: string): string {
  return path.replace(/\\/g, "/");
}

function collectMarkdownFiles(dir: string, rootPath: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, rootPath, out);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(toPosix(relative(rootPath, fullPath)));
    }
  }
}

/**
 * Validates repository docs structure: paths, status headers, and index links.
 *
 * @param rootPath - Repository root to validate.
 * @returns Findings for structural documentation violations.
 */
export function validateDocsStructure(rootPath: string): Finding[] {
  const findings: Finding[] = [];

  for (const fileRel of REQUIRED_FILES) {
    if (!existsSync(join(rootPath, fileRel))) {
      findings.push({
        id: "DOC-002",
        severity: "error",
        path: fileRel,
        message: `Missing required knowledge layout file: ${fileRel}`,
        remediation:
          "Create the file per docs/product-specs/harness-blueprint.md knowledge layout",
      });
    }
  }

  for (const dirRel of REQUIRED_DIRS) {
    if (!existsSync(join(rootPath, dirRel))) {
      findings.push({
        id: "DOC-002",
        severity: "error",
        path: dirRel,
        message: `Missing required knowledge layout directory: ${dirRel}`,
        remediation:
          "Create the directory per docs/product-specs/harness-blueprint.md knowledge layout",
      });
    }
  }

  const statusTargets: string[] = ["ARCHITECTURE.md"];
  const docsDir = join(rootPath, "docs");
  if (existsSync(docsDir)) {
    collectMarkdownFiles(docsDir, rootPath, statusTargets);
  }

  for (const relPath of statusTargets) {
    const fullPath = join(rootPath, relPath);
    if (!existsSync(fullPath)) {
      continue;
    }

    const firstLines = readFileSync(fullPath, "utf8").split("\n").slice(0, 15);
    const hasStatus = firstLines.some((line: string) =>
      STATUS_HEADER_PATTERN.test(line.trim()),
    );

    if (!hasStatus) {
      findings.push({
        id: "DOC-003",
        severity: "error",
        path: relPath,
        message: "Missing Status header in first 15 lines",
        remediation: "Add a Status: line near the top of the document",
      });
    }
  }

  for (const indexRel of INDEX_FILES) {
    const indexPath = join(rootPath, indexRel);
    if (!existsSync(indexPath)) {
      continue;
    }

    const content = readFileSync(indexPath, "utf8");
    const indexDir = join(rootPath, indexRel.replace(/\/[^/]+$/, ""));
    const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

    for (const match of content.matchAll(linkPattern)) {
      const target = match[1];
      if (!target || !target.endsWith(".md")) {
        continue;
      }
      if (target.startsWith("http://") || target.startsWith("https://")) {
        continue;
      }

      const linkedPath = join(indexDir, target);
      if (!existsSync(linkedPath)) {
        findings.push({
          id: "DOC-004",
          severity: "error",
          path: indexRel,
          message: `Broken index link: ${target} does not exist`,
          remediation: `Fix or remove the link to ${target} in ${indexRel}`,
        });
      }
    }
  }

  return findings;
}
