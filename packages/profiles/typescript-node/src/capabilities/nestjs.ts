import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Paths added by the nestjs capability scaffold. */
export const NESTJS_SCAFFOLD_PATHS = [
  "src/main.ts",
  "src/app.module.ts",
  "src/app.controller.ts",
] as const;

function mergePackageJson(projectRoot: string, extra: Record<string, unknown>): void {
  const packagePath = join(projectRoot, "package.json");
  const current = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
  const deps = (current.dependencies as Record<string, string>) ?? {};
  const devDeps = (current.devDependencies as Record<string, string>) ?? {};

  const extraDeps = (extra.dependencies as Record<string, string>) ?? {};
  const extraDev = (extra.devDependencies as Record<string, string>) ?? {};

  writeFileSync(
    packagePath,
    JSON.stringify(
      {
        ...current,
        dependencies: { ...deps, ...extraDeps },
        devDependencies: { ...devDeps, ...extraDev },
        scripts: {
          ...(current.scripts as Record<string, string>),
          ...(extra.scripts as Record<string, string>),
        },
      },
      null,
      2,
    ),
  );
}

/**
 * Adds NestJS application wiring on top of base scaffold.
 *
 * @param projectRoot - Target project directory (base scaffold required).
 * @returns Relative paths written.
 */
export function scaffoldNestjs(projectRoot: string): string[] {
  mergePackageJson(projectRoot, {
    scripts: { start: "node dist/main.js" },
    dependencies: {
      "@nestjs/common": "^11.0.0",
      "@nestjs/core": "^11.0.0",
      "@nestjs/platform-express": "^11.0.0",
      "reflect-metadata": "^0.2.2",
      rxjs: "^7.8.2",
    },
    devDependencies: {
      "@nestjs/cli": "^11.0.0",
    },
  });

  writeFileSync(
    join(projectRoot, "src/main.ts"),
    `import "reflect-metadata";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT ?? 3000));
}

bootstrap();
`,
  );

  writeFileSync(
    join(projectRoot, "src/app.module.ts"),
    `import { Module } from "@nestjs/common";

import { AppController } from "./app.controller.js";

@Module({
  controllers: [AppController],
})
export class AppModule {}
`,
  );

  writeFileSync(
    join(projectRoot, "src/app.controller.ts"),
    `import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  health(): { status: string } {
    return { status: "ok" };
  }
}
`,
  );

  return [...NESTJS_SCAFFOLD_PATHS];
}
