import { describe, expect, it } from "vitest";

import {
  canResumeFrom,
  getResumeState,
  recordCheckpoint,
  type Checkpoint,
} from "../src/checkpoint.js";
import { readFixture } from "./read-fixture.js";

interface CheckpointFixture {
  checkpoints: Checkpoint[];
  resumeState: string;
}

describe("checkpoint", () => {
  it("resumes from the last verified checkpoint state", () => {
    const fixture = readFixture<CheckpointFixture>("checkpoint-resume.json");

    expect(getResumeState(fixture.checkpoints)).toBe(fixture.resumeState);
    expect(canResumeFrom(fixture.checkpoints, "DOCS_MAPPED")).toBe(true);
  });

  it("records checkpoints with required evidence", () => {
    const checkpoint = recordCheckpoint(
      "DISCOVERED",
      {
        inputsChecksum: "sha256:in",
        outputsChecksum: "sha256:out",
      },
      "2026-07-23T00:00:00.000Z",
    );

    expect(checkpoint.state).toBe("DISCOVERED");
    expect(checkpoint.recordedAt).toBe("2026-07-23T00:00:00.000Z");
  });

  it("rejects empty checksums", () => {
    expect(() =>
      recordCheckpoint("DISCOVERED", {
        inputsChecksum: "",
        outputsChecksum: "sha256:out",
      }),
    ).toThrow("CheckpointEvidence.inputsChecksum must be non-empty");
  });

  it("allows resume from DISCOVERED when history is empty", () => {
    expect(canResumeFrom([], "DISCOVERED")).toBe(true);
    expect(canResumeFrom([], "DOCS_MAPPED")).toBe(false);
  });
});
