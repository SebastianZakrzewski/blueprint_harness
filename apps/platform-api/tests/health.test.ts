import { describe, expect, it } from "vitest";

import { healthStatus } from "../src/index.js";

describe("platform-api (HP1)", () => {
  it("reports health without starting a server", () => {
    expect(healthStatus()).toEqual({ ok: true, schemaId: "result-envelope@1" });
  });
});
