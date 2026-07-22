import { describe, expect, it } from "vitest";

import {
  BOOTSTRAP_STATE_COUNT,
  BOOTSTRAP_STATE_ORDER,
  isBootstrapState,
  isValidBootstrapTransition,
} from "../src/lifecycle.js";

describe("lifecycle", () => {
  it("defines exactly 8 bootstrap states in canonical order", () => {
    expect(BOOTSTRAP_STATE_COUNT).toBe(8);
    expect(BOOTSTRAP_STATE_ORDER).toEqual([
      "DISCOVERED",
      "DOCS_MAPPED",
      "DOCS_VALIDATED",
      "HARNESS_INSTALLED",
      "SCAFFOLD_GENERATED",
      "VALIDATION_PASSED",
      "PR_OPENED",
      "COMPLETE",
    ]);
  });

  it("allows idempotent and +1 sequential transitions", () => {
    expect(
      isValidBootstrapTransition("DISCOVERED", "DISCOVERED"),
    ).toBe(true);
    expect(
      isValidBootstrapTransition("DISCOVERED", "DOCS_MAPPED"),
    ).toBe(true);
    expect(
      isValidBootstrapTransition("PR_OPENED", "COMPLETE"),
    ).toBe(true);
  });

  it("rejects invalid bootstrap transitions", () => {
    expect(
      isValidBootstrapTransition("DISCOVERED", "COMPLETE"),
    ).toBe(false);
    expect(
      isValidBootstrapTransition("COMPLETE", "PR_OPENED"),
    ).toBe(false);
  });

  it("parses bootstrap states at the boundary", () => {
    expect(isBootstrapState("HARNESS_INSTALLED")).toBe(true);
    expect(isBootstrapState("INVALID")).toBe(false);
  });
});
