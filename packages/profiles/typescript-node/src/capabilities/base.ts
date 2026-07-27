import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Files written by the base capability scaffold. */
export const BASE_SCAFFOLD_PATHS = [
  "package.json",
  "tsconfig.json",
  "vitest.config.ts",
  "src/server.ts",
  "src/server.test.ts",
] as const;

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));

function readHealthServerTemplate(): string {
  const localTemplate = join(PACKAGE_ROOT, "health-server.ts");
  if (existsSync(localTemplate)) {
    return readFileSync(localTemplate, "utf8");
  }

  const packageSrcTemplate = join(
    PACKAGE_ROOT,
    "..",
    "..",
    "src",
    "capabilities",
    "health-server.ts",
  );
  return readFileSync(packageSrcTemplate, "utf8");
}

const PACKAGE_JSON = {
  name: "app",
  private: true,
  type: "module",
  scripts: {
    build: "tsc -p tsconfig.json",
    test: "vitest run",
    start: "node dist/server.js",
  },
  devDependencies: {
    "@types/node": "^22.15.21",
    typescript: "^5.8.3",
    vitest: "^3.2.4",
  },
};

const TSCONFIG = {
  compilerOptions: {
    target: "ES2022",
    module: "NodeNext",
    moduleResolution: "NodeNext",
    outDir: "dist",
    rootDir: "src",
    strict: true,
    skipLibCheck: true,
  },
  include: ["src/**/*"],
};

const VITEST_CONFIG = `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
`;

const SERVER_TS = readHealthServerTemplate().replace(
  "export function createHealthServer",
  "function createHealthServer",
) + `
if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const port = Number(process.env.PORT ?? 3000);
  createHealthServer().listen(port);
}
`;

const SERVER_TEST = `import { describe, expect, it } from "vitest";
import { createServer } from "node:http";

function createHealthServer() {
  return createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }
    response.writeHead(404);
    response.end();
  });
}

describe("health server", () => {
  it("returns 200 JSON status ok on /health", async () => {
    const server = createHealthServer();
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;

    const response = await fetch(\`http://127.0.0.1:\${port}/health\`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });

    server.close();
  });
});
`;

/**
 * Scaffolds base Node/TS project with health route and vitest.
 *
 * @param projectRoot - Target project directory.
 * @returns Relative paths written.
 */
export function scaffoldBase(projectRoot: string): string[] {
  mkdirSync(join(projectRoot, "src"), { recursive: true });

  writeFileSync(join(projectRoot, "package.json"), JSON.stringify(PACKAGE_JSON, null, 2));
  writeFileSync(join(projectRoot, "tsconfig.json"), JSON.stringify(TSCONFIG, null, 2));
  writeFileSync(join(projectRoot, "vitest.config.ts"), VITEST_CONFIG);
  writeFileSync(join(projectRoot, "src/server.ts"), SERVER_TS);
  writeFileSync(join(projectRoot, "src/server.test.ts"), SERVER_TEST);

  return [...BASE_SCAFFOLD_PATHS];
}
