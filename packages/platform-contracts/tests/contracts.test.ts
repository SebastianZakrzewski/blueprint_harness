import { describe, expect, it } from "vitest";

import { PLATFORM_CONTRACTS_VERSION, RESULT_ENVELOPE_SCHEMA_ID } from "../src/index.js";

describe("platform-contracts (HP1)", () => {
  it("exports stable contract identifiers", () => {
    expect(PLATFORM_CONTRACTS_VERSION).toBe("0.0.0");
    expect(RESULT_ENVELOPE_SCHEMA_ID).toBe("result-envelope@1");
  });
});
