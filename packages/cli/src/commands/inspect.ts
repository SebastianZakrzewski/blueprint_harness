import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { resolveRepoRoot } from "@blueprint-harness/core";

import type { OutputFormat } from "../output.js";

export interface InspectPackage {
  name: string;
  version: string;
  path: string;
}

export interface InspectResult {
  blueprintVersion: string;
  packages: InspectPackage[];
}

const WORKSPACE_PACKAGE_ROOTS = [
  "packages/cli",
  "packages/core",
  "packages/profile-sdk",
  "packages/template-openai",
  "packages/profiles/typescript-node",
] as const;

/**
 * Collects blueprint version and workspace package graph for inspect output.
 *
 * @param rootPath - Repository root.
 * @returns Inspect JSON payload.
 */
export function buildInspectResult(rootPath: string): InspectResult {
  const rootPackagePath = join(rootPath, "package.json");
  const blueprintVersion = existsSync(rootPackagePath)
    ? ((JSON.parse(readFileSync(rootPackagePath, "utf8")).version as string | undefined) ??
      "0.0.0")
    : "0.0.0";

  const packages: InspectPackage[] = [];

  for (const relativePath of WORKSPACE_PACKAGE_ROOTS) {
    const packageRoot = join(rootPath, relativePath);
    const pkgPath = join(packageRoot, "package.json");
    if (!existsSync(pkgPath)) {
      continue;
    }

    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name: string; version: string };
    packages.push({
      name: pkg.name,
      version: pkg.version,
      path: relativePath,
    });
  }

  packages.sort((left, right) => left.name.localeCompare(right.name));

  return { blueprintVersion, packages };
}

export interface InspectCommandOptions {
  rootPath?: string;
  format?: OutputFormat;
}

/**
 * Prints inspect JSON with blueprint version and workspace packages.
 *
 * @param options - Optional repo root and output format.
 * @returns Process exit code (always 0).
 */
export function runInspect(options: InspectCommandOptions = {}): number {
  const startPath = options.rootPath ?? process.cwd();
  const rootPath = resolveRepoRoot(startPath);
  const format = options.format ?? "human";
  const result = buildInspectResult(rootPath);

  if (format === "json") {
    console.log(JSON.stringify(result));
    return 0;
  }

  console.log(`blueprintVersion: ${result.blueprintVersion}`);
  for (const pkg of result.packages) {
    console.log(`${pkg.name}@${pkg.version} (${pkg.path})`);
  }
  return 0;
}
