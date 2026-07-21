import { describe, expect, it } from "vitest";

import { packageIdentity } from "./index.js";

describe("@blueprint-harness/profile-sdk", () => {
  it("exposes package name and version", () => {
    expect(packageIdentity.name).toBe("@blueprint-harness/profile-sdk");
    expect(packageIdentity.version).toBe("0.0.0");
  });
});
