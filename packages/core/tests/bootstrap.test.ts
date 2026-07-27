import { execSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loadCheckpoints, runBootstrap } from "../src/index.js";

const FIXTURES = join(fileURLToPath(import.meta.url), "..", "fixtures");
const DOCS_CANONICAL = join(FIXTURES, "docs-canonical");

const mockRenderHarness = () => [".cursor/hooks.json"];

function initGitRepo(dir: string): void {
  writeFileSync(join(dir, ".gitkeep"), "", "utf8");
  execSync("git init", { cwd: dir, stdio: "ignore" });
  execSync("git add .", { cwd: dir, stdio: "ignore" });
  execSync("git -c user.email=test@test.com -c user.name=test commit -m anchor", {
    cwd: dir,
    stdio: "ignore",
  });
}

describe("bootstrap init (M8)", () => {
  it("reaches HARNESS_INSTALLED with canonical docs (M8-AC1)", async () => {
    const target = mkdtempSync(join(tmpdir(), "harness-bootstrap-"));
    initGitRepo(target);

    const result = await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      skipAnchorCheck: true,
      renderHarness: mockRenderHarness,
    });

    expect(result.ok).toBe(true);
    expect(result.state).toBe("HARNESS_INSTALLED");
    expect(existsSync(join(target, "harness.config.ts"))).toBe(true);
    expect(existsSync(join(target, "harness.lock.json"))).toBe(true);

    rmSync(target, { recursive: true, force: true });
  });

  it("resumes without duplicate checkpoints (M8-AC2)", async () => {
    const target = mkdtempSync(join(tmpdir(), "harness-bootstrap-"));
    initGitRepo(target);

    const first = await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      skipAnchorCheck: true,
      renderHarness: mockRenderHarness,
    });
    const checkpointCount = loadCheckpoints(target).length;

    const second = await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      skipAnchorCheck: true,
      renderHarness: mockRenderHarness,
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(loadCheckpoints(target).length).toBe(checkpointCount);

    rmSync(target, { recursive: true, force: true });
  });

  it("records checkpoints with checksums (M8-AC4)", async () => {
    const target = mkdtempSync(join(tmpdir(), "harness-bootstrap-"));
    initGitRepo(target);

    await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      skipAnchorCheck: true,
      renderHarness: mockRenderHarness,
    });

    const checkpoints = loadCheckpoints(target);
    expect(checkpoints.length).toBeGreaterThan(0);
    for (const checkpoint of checkpoints) {
      expect(checkpoint.evidence.inputsChecksum.length).toBeGreaterThan(0);
      expect(checkpoint.evidence.outputsChecksum.length).toBeGreaterThan(0);
    }

    rmSync(target, { recursive: true, force: true });
  });

  it("stops when anchor commit missing (M8-AC5)", async () => {
    const target = mkdtempSync(join(tmpdir(), "harness-bootstrap-"));

    const result = await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      renderHarness: mockRenderHarness,
    });

    expect(result.ok).toBe(false);
    expect(result.findings.some((finding) => finding.id === "BOOTSTRAP-001")).toBe(true);

    rmSync(target, { recursive: true, force: true });
  });

  it("self-apply skips docs copy and preserves sentinel file (M8-AC6)", async () => {
    const target = mkdtempSync(join(tmpdir(), "harness-bootstrap-"));
    initGitRepo(target);

    const sentinel = join(target, "docs", "PRODUCT_SENSE.md");
    const original = "Status: APPROVED\n# Sentinel content\n";
    mkdirSync(join(target, "docs"), { recursive: true });
    writeFileSync(sentinel, original, "utf8");

    const result = await runBootstrap({
      docsPath: DOCS_CANONICAL,
      targetDir: target,
      selfApply: true,
      skipAnchorCheck: true,
      renderHarness: mockRenderHarness,
    });

    expect(result.ok).toBe(true);
    expect(readFileSync(sentinel, "utf8")).toBe(original);
    expect(existsSync(join(target, "harness.config.ts"))).toBe(true);

    rmSync(target, { recursive: true, force: true });
  });
});
