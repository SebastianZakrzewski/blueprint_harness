import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { createHealthServer } from "../src/capabilities/health-server.js";
import { scaffoldBase } from "../src/capabilities/base.js";
import { DEFAULT_BASE_PROPOSAL, typescriptNodeProfile } from "../src/profile.js";

describe("typescript-node profile (M9-AC3)", () => {
  it("health endpoint returns 200 with JSON status ok", async () => {
    const server = createHealthServer();
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;

    const response = await fetch(`http://127.0.0.1:${port}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });

    server.close();
  });

  it("scaffold writes runnable base project structure", async () => {
    const target = mkdtempSync(join(tmpdir(), "profile-scaffold-"));
    scaffoldBase(target);

    const context = { projectRoot: target, profileId: "typescript-node" };
    const result = await typescriptNodeProfile.scaffold(context, DEFAULT_BASE_PROPOSAL);
    expect(result.ok).toBe(true);

    rmSync(target, { recursive: true, force: true });
  });
});
