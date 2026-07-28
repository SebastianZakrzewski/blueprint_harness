import { describe, expect, it } from "vitest";

import { supportedEnvelopeSchemaId } from "../src/index.js";

describe("platform-domain (HP1)", () => {
  it("depends only on platform contracts", () => {
    expect(supportedEnvelopeSchemaId()).toBe("result-envelope@1");
  });
});
