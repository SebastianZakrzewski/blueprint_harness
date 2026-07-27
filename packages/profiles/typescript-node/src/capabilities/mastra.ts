import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Paths added by the mastra capability scaffold. */
export const MASTRA_SCAFFOLD_PATHS = ["src/mastra/index.ts"] as const;

function mergePackageJson(projectRoot: string, extra: Record<string, unknown>): void {
  const packagePath = join(projectRoot, "package.json");
  const current = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
  writeFileSync(
    packagePath,
    JSON.stringify(
      {
        ...current,
        dependencies: {
          ...((current.dependencies as Record<string, string>) ?? {}),
          ...((extra.dependencies as Record<string, string>) ?? {}),
        },
      },
      null,
      2,
    ),
  );
}

/**
 * Adds Mastra agent runtime scaffold.
 *
 * @param projectRoot - Target project directory.
 * @returns Relative paths written.
 */
export function scaffoldMastra(projectRoot: string): string[] {
  mergePackageJson(projectRoot, {
    dependencies: {
      "@mastra/core": "^0.10.0",
    },
  });

  mkdirSync(join(projectRoot, "src/mastra"), { recursive: true });
  writeFileSync(
    join(projectRoot, "src/mastra/index.ts"),
    `/** Mastra agent runtime entry (reference scaffold). */
export const mastraRuntime = {
  name: "reference-agent",
  tools: [],
};
`,
  );

  return [...MASTRA_SCAFFOLD_PATHS];
}
