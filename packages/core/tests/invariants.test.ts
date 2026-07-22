import { describe, expect, it } from "vitest";

import {
  INVARIANT_CATALOG,
  INVARIANT_COUNT,
  INVARIANT_IDS,
  isInvariantId,
} from "../src/invariants.js";
import { readFixture } from "./read-fixture.js";

describe("invariants", () => {
  it("exports exactly 18 invariant IDs matching the design doc fixture", () => {
    const fixture = readFixture<string[]>("invariant-catalog.json");

    expect(INVARIANT_COUNT).toBe(18);
    expect(INVARIANT_IDS).toHaveLength(18);
    expect([...INVARIANT_IDS].sort()).toEqual([...fixture].sort());
  });

  it("maps every invariant ID to a non-empty intent string", () => {
    for (const id of INVARIANT_IDS) {
      expect(INVARIANT_CATALOG[id].length).toBeGreaterThan(0);
      expect(isInvariantId(id)).toBe(true);
    }
  });

  it("rejects unknown invariant IDs at the boundary", () => {
    expect(isInvariantId("ARCH-999")).toBe(false);
    expect(isInvariantId(null)).toBe(false);
  });
});
