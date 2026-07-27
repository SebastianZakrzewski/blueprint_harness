import { describe, expect, it } from "vitest";

import {
  FINDING_CAPABILITY_INCOMPATIBLE,
  FINDING_CAPABILITY_MISSING_DEPENDENCY,
  FINDING_CAPABILITY_UNKNOWN,
  type CapabilityDefinition,
  resolveCapabilities,
} from "../src/index.js";

const REFERENCE_CATALOG: CapabilityDefinition[] = [
  {
    id: "base",
    dependsOn: [],
    incompatibleWith: [],
    installOrder: 1,
  },
  {
    id: "nestjs",
    dependsOn: ["base"],
    incompatibleWith: [],
    installOrder: 2,
  },
  {
    id: "database",
    dependsOn: ["nestjs"],
    incompatibleWith: [],
    installOrder: 3,
  },
  {
    id: "legacy-sql",
    dependsOn: ["nestjs"],
    incompatibleWith: ["database"],
    installOrder: 3,
  },
];

describe("resolveCapabilities (M5-AC2)", () => {
  it("returns ordered proposal for compatible set", () => {
    const result = resolveCapabilities({
      requested: ["database", "base", "nestjs"],
      catalog: REFERENCE_CATALOG,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.proposal.installOrder).toEqual(["base", "nestjs", "database"]);
    }
  });

  it("returns CAPABILITY-001 before install for incompatible pair", () => {
    const result = resolveCapabilities({
      requested: ["base", "nestjs", "database", "legacy-sql"],
      catalog: REFERENCE_CATALOG,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.findings.some((f) => f.id === FINDING_CAPABILITY_INCOMPATIBLE)).toBe(
        true,
      );
    }
  });

  it("returns CAPABILITY-002 when dependency missing", () => {
    const result = resolveCapabilities({
      requested: ["nestjs"],
      catalog: REFERENCE_CATALOG,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.findings[0]?.id).toBe(FINDING_CAPABILITY_MISSING_DEPENDENCY);
    }
  });

  it("returns CAPABILITY-003 for unknown capability id", () => {
    const result = resolveCapabilities({
      requested: ["base", "unknown-cap"],
      catalog: REFERENCE_CATALOG,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.findings[0]?.id).toBe(FINDING_CAPABILITY_UNKNOWN);
    }
  });
});
