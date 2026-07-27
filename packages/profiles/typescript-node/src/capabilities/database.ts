import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { readFileSync } from "node:fs";

/** Paths added by the database capability scaffold. */
export const DATABASE_SCAFFOLD_PATHS = [
  "drizzle.config.ts",
  "src/db/schema.ts",
  "docker/postgres.compose.yaml",
] as const;

function mergePackageJson(projectRoot: string, extra: Record<string, unknown>): void {
  const packagePath = join(projectRoot, "package.json");
  const current = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
  const deps = (current.dependencies as Record<string, string>) ?? {};
  const devDeps = (current.devDependencies as Record<string, string>) ?? {};

  writeFileSync(
    packagePath,
    JSON.stringify(
      {
        ...current,
        dependencies: {
          ...deps,
          ...((extra.dependencies as Record<string, string>) ?? {}),
        },
        devDependencies: {
          ...devDeps,
          ...((extra.devDependencies as Record<string, string>) ?? {}),
        },
      },
      null,
      2,
    ),
  );
}

/**
 * Adds Drizzle + PostgreSQL scaffold and Compose fragment.
 *
 * @param projectRoot - Target project directory (nestjs scaffold required).
 * @returns Relative paths written.
 */
export function scaffoldDatabase(projectRoot: string): string[] {
  mergePackageJson(projectRoot, {
    dependencies: {
      "drizzle-orm": "^0.44.0",
      pg: "^8.16.0",
    },
    devDependencies: {
      "drizzle-kit": "^0.31.0",
    },
  });

  writeFileSync(
    join(projectRoot, "drizzle.config.ts"),
    `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/app",
  },
});
`,
  );

  mkdirSync(join(projectRoot, "src/db"), { recursive: true });
  writeFileSync(
    join(projectRoot, "src/db/schema.ts"),
    `import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(),
});
`,
  );

  mkdirSync(join(projectRoot, "docker"), { recursive: true });
  writeFileSync(
    join(projectRoot, "docker/postgres.compose.yaml"),
    `services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
`,
  );

  return [...DATABASE_SCAFFOLD_PATHS];
}
