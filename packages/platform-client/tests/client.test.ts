import { describe, expect, it } from "vitest";

import { clientContractVersion } from "../src/index.js";

describe("platform-client (HP1)", () => {
  it("exposes contract version without domain imports", () => {
    expect(clientContractVersion()).toBe("0.0.0");
  });
});
