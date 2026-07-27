import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Paths added by the supabase capability scaffold. */
export const SUPABASE_SCAFFOLD_PATHS = [
  "supabase/config.toml",
  "src/lib/supabase.ts",
] as const;

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
 * Adds local Supabase client wiring (OD-004).
 *
 * @param projectRoot - Target project directory.
 * @returns Relative paths written.
 */
export function scaffoldSupabase(projectRoot: string): string[] {
  mergePackageJson(projectRoot, {
    dependencies: {
      "@supabase/supabase-js": "^2.50.0",
    },
  });

  mkdirSync(join(projectRoot, "supabase"), { recursive: true });
  writeFileSync(
    join(projectRoot, "supabase/config.toml"),
    `project_id = "local-reference"

[api]
port = 54321
`,
  );

  mkdirSync(join(projectRoot, "src/lib"), { recursive: true });
  writeFileSync(
    join(projectRoot, "src/lib/supabase.ts"),
    `import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
  const key = process.env.SUPABASE_ANON_KEY ?? "local-anon-key";
  return createClient(url, key);
}
`,
  );

  return [...SUPABASE_SCAFFOLD_PATHS];
}
