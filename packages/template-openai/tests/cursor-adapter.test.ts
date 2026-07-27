import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CURSOR_SURFACE_PATHS } from "../src/cursor-adapter.js";
import { renderTemplate } from "../src/render.js";

const CONTEXT = {
  projectName: "Acme App",
  profileId: "typescript-node",
  blueprintVersion: "0.0.0",
};

const SECRET_PATTERNS = [
  /api[_-]?key/i,
  /password\s*[:=]/i,
  /AKIA[0-9A-Z]{16}/,
];

describe("cursor adapter", () => {
  it("renders all four Cursor surfaces (M4-AC1)", () => {
    const target = mkdtempSync(join(tmpdir(), "cursor-render-"));

    try {
      renderTemplate(target, CONTEXT);

      for (const surface of CURSOR_SURFACE_PATHS) {
        const normalized = surface.endsWith("/") ? surface.slice(0, -1) : surface;
        expect(existsSync(join(target, normalized))).toBe(true);
      }
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("routes rules to repository docs without duplicating canon (M4-AC2)", () => {
    const target = mkdtempSync(join(tmpdir(), "cursor-render-"));

    try {
      renderTemplate(target, CONTEXT);
      const rule = readFileSync(join(target, ".cursor/rules/harness-entry.mdc"), "utf8");
      expect(rule).toContain("AGENTS.md");
      expect(rule).toContain("docs/product-specs/index.md");
      expect(rule).not.toContain("Status: APPROVED");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("hooks.json references harness check --fast (M4-AC3)", () => {
    const target = mkdtempSync(join(tmpdir(), "cursor-render-"));

    try {
      renderTemplate(target, CONTEXT);
      const hooks = readFileSync(join(target, ".cursor/hooks.json"), "utf8");
      expect(hooks).toContain("harness check --fast");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("render output contains no secret-like patterns (M4-AC4)", () => {
    const target = mkdtempSync(join(tmpdir(), "cursor-render-"));

    try {
      renderTemplate(target, CONTEXT);
      const hooks = readFileSync(join(target, ".cursor/hooks.json"), "utf8");

      for (const pattern of SECRET_PATTERNS) {
        expect(hooks).not.toMatch(pattern);
      }
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
