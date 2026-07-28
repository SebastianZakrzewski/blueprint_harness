import { describe, expect, it } from "vitest";

import { workerReady } from "../src/index.js";

describe("platform-workers (HP1)", () => {
  it("reports worker readiness", () => {
    expect(workerReady().ready).toBe(true);
  });
});
