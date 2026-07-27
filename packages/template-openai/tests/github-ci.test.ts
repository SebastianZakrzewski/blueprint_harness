import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { GITHUB_CI_PATHS } from "../src/github-ci.js";
import { renderTemplate } from "../src/render.js";

const CONTEXT = {
  projectName: "Acme App",
  profileId: "typescript-node",
  blueprintVersion: "0.0.0",
};

describe("github ci templates (M12)", () => {
  it("renders equivalent CI workflows for generated projects (M12-AC5)", () => {
    const target = mkdtempSync(join(tmpdir(), "github-ci-render-"));

    try {
      renderTemplate(target, CONTEXT);

      for (const workflowPath of GITHUB_CI_PATHS) {
        expect(existsSync(join(target, workflowPath))).toBe(true);
      }
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
