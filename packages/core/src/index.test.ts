import { describe, expect, it } from "vitest";

import { packageIdentity } from "./index.js";

describe("@blueprint-harness/core", () => {
  it("exposes package name and version", () => {
    expect(packageIdentity.name).toBe("@blueprint-harness/core");
    expect(packageIdentity.version).toBe("0.0.0");
  });
});
