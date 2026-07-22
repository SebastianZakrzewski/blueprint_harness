import { describe, expect, it } from "vitest";

import {
  createFileOwnershipMetadata,
  isFileOwnershipClass,
} from "../src/ownership.js";

describe("ownership", () => {
  it("creates validated ownership metadata", () => {
    const metadata = createFileOwnershipMetadata({
      path: "AGENTS.md",
      class: "MERGE_CONTROLLED",
      checksum: "sha256:abc",
    });

    expect(metadata.path).toBe("AGENTS.md");
    expect(metadata.class).toBe("MERGE_CONTROLLED");
  });

  it("rejects empty path", () => {
    expect(() =>
      createFileOwnershipMetadata({
        path: "",
        class: "PROJECT_OWNED",
      }),
    ).toThrow("FileOwnershipMetadata.path must be non-empty");
  });

  it("parses ownership classes at the boundary", () => {
    expect(isFileOwnershipClass("GENERATED")).toBe(true);
    expect(isFileOwnershipClass("UNKNOWN")).toBe(false);
  });
});
