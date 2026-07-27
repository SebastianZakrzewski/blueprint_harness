import { copyFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  deployStagingArtifact,
  loadReleaseManifest,
  readArtifactContent,
  rollbackStagingArtifact,
  verifyStagingDeployment,
} from "@blueprint-harness/core";

function seedStagingCompose(target: string): void {
  mkdirSync(join(target, "docker"), { recursive: true });
  copyFileSync(
    join(process.cwd(), "docker", "compose.staging.yml"),
    join(target, "docker", "compose.staging.yml"),
  );
}

describe("release rollback gate (M14a)", () => {
  it("deploys staging artifact and verifies checksum (M14-AC1)", () => {
    const target = mkdtempSync(join(tmpdir(), "release-gate-"));

    try {
      seedStagingCompose(target);

      const first = deployStagingArtifact(target, "artifact-v1-bytes");
      expect(first.manifest.state).toBe("STAGING_DEPLOYED");

      const verify = verifyStagingDeployment(target);
      expect(verify.ok).toBe(true);

      deployStagingArtifact(target, "artifact-v2-bytes");
      const rollback = rollbackStagingArtifact(target);
      expect(rollback.ok).toBe(true);

      const manifest = loadReleaseManifest(target);
      expect(manifest?.currentArtifactId).toBe(first.manifest.currentArtifactId);
      expect(readArtifactContent(target, first.manifest.currentArtifactId)).toBe("artifact-v1-bytes");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("rollback restores previous artifact bytes (M14-AC2)", () => {
    const target = mkdtempSync(join(tmpdir(), "release-rollback-"));

    try {
      seedStagingCompose(target);

      const first = deployStagingArtifact(target, "bytes-before");
      verifyStagingDeployment(target);
      deployStagingArtifact(target, "bytes-after");
      rollbackStagingArtifact(target);

      expect(readArtifactContent(target, first.manifest.currentArtifactId)).toBe("bytes-before");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
