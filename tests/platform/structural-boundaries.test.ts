import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readPackageJson(dir: string): PackageJson {
  return JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as PackageJson;
}

function listWorkspacePackages(): { dir: string; pkg: PackageJson }[] {
  const results: { dir: string; pkg: PackageJson }[] = [];
  const roots = [
    join(ROOT, "packages"),
    join(ROOT, "packages", "profiles"),
    join(ROOT, "apps"),
  ];

  for (const root of roots) {
    if (!existsSync(root)) {
      continue;
    }
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      const dir = join(root, entry.name);
      if (existsSync(join(dir, "package.json"))) {
        results.push({ dir, pkg: readPackageJson(dir) });
      }
    }
  }
  return results;
}

function allDeps(pkg: PackageJson): string[] {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ];
}

describe("platform structural boundaries (HP1)", () => {
  const packages = listWorkspacePackages();

  it("Blueprint packages do not import Platform packages (HP1-AC2)", () => {
    const blueprintNames = new Set([
      "@blueprint-harness/core",
      "@blueprint-harness/cli",
      "@blueprint-harness/template-openai",
      "@blueprint-harness/profile-sdk",
      "@blueprint-harness/profiles-typescript-node",
    ]);

    for (const { pkg } of packages) {
      if (!pkg.name || !blueprintNames.has(pkg.name)) {
        continue;
      }
      for (const dep of allDeps(pkg)) {
        expect(dep.startsWith("@blueprint-harness/platform-")).toBe(false);
      }
    }
  });

  it("platform-client does not depend on platform-domain (HP1-AC2)", () => {
    const client = packages.find((p) => p.pkg.name === "@blueprint-harness/platform-client");
    expect(client).toBeDefined();
    expect(allDeps(client!.pkg)).not.toContain("@blueprint-harness/platform-domain");
  });

  it("platform-client does not depend on api or workers apps", () => {
    const client = packages.find((p) => p.pkg.name === "@blueprint-harness/platform-client");
    for (const dep of allDeps(client!.pkg)) {
      expect(dep).not.toMatch(/platform-api|platform-workers/);
    }
  });
});
