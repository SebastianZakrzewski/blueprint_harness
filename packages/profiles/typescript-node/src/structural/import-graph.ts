import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { buildValidationResult, type Finding } from "@blueprint-harness/core";

function collectTsFiles(dir: string, out: string[]): void {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsFiles(full, out);
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
}

function resolveRelativeImport(fromFile: string, importPath: string, srcRoot: string): string | null {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const normalizedImport = importPath.replace(/\.(js|jsx)$/, "");
  const base = join(fromFile, "..", normalizedImport);
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, "index.ts"),
    join(fromFile, "..", importPath),
    `${join(fromFile, "..", importPath)}.ts`,
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return relative(srcRoot, candidate).replace(/\\/g, "/");
    }
  }

  return relative(srcRoot, base).replace(/\\/g, "/");
}

function findCycle(nodes: string[], edges: Map<string, string[]>): string[] | null {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const path: string[] = [];

  function visit(node: string): string[] | null {
    if (stack.has(node)) {
      const cycleStart = path.indexOf(node);
      return path.slice(cycleStart).concat(node);
    }
    if (visited.has(node)) {
      return null;
    }

    visited.add(node);
    stack.add(node);
    path.push(node);

    for (const next of edges.get(node) ?? []) {
      const cycle = visit(next);
      if (cycle) {
        return cycle;
      }
    }

    path.pop();
    stack.delete(node);
    return null;
  }

  for (const node of nodes) {
    const cycle = visit(node);
    if (cycle) {
      return cycle;
    }
  }

  return null;
}

/**
 * Detects prohibited import cycles inside the project src tree.
 *
 * @param projectRoot - Project root containing src/.
 */
export function runStructuralImportGraph(
  projectRoot: string,
): ReturnType<typeof buildValidationResult> {
  const srcRoot = join(projectRoot, "src");
  const files: string[] = [];
  collectTsFiles(srcRoot, files);

  const edges = new Map<string, string[]>();
  const importRe = /from\s+["']([^"']+)["']/g;

  for (const filePath of files) {
    const node = relative(srcRoot, filePath).replace(/\\/g, "/");
    const content = readFileSync(filePath, "utf8");
    const targets: string[] = [];

    for (const match of content.matchAll(importRe)) {
      const specifier = match[1];
      if (!specifier) {
        continue;
      }
      const resolved = resolveRelativeImport(filePath, specifier, srcRoot);
      if (resolved) {
        targets.push(resolved);
      }
    }

    edges.set(node, targets);
  }

  const cycle = findCycle([...edges.keys()], edges);
  if (!cycle) {
    return buildValidationResult([]);
  }

  const findings: Finding[] = [
    {
      id: "ARCH-003",
      severity: "error",
      path: cycle[0],
      message: `Import cycle detected: ${cycle.join(" -> ")}`,
      remediation: "Break the cycle via a public boundary or composition root.",
    },
  ];

  return buildValidationResult(findings);
}
