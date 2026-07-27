import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  CURSOR_ADAPTER_ENTRIES,
  KNOWLEDGE_LAYOUT_ENTRIES,
  KNOWLEDGE_LAYOUT_PATHS,
  getFileOwnershipManifest,
  renderTemplate,
} from "../src/index.js";

const CONTEXT = {
  projectName: "Acme App",
  profileId: "typescript-node",
  blueprintVersion: "0.0.0",
};

function normalizeLayoutPath(path: string): string {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

describe("template-openai render", () => {
  it("creates every harness-blueprint knowledge layout path (M3-AC1)", () => {
    const target = mkdtempSync(join(tmpdir(), "template-render-"));

    try {
      renderTemplate(target, CONTEXT);

      for (const layoutPath of KNOWLEDGE_LAYOUT_PATHS) {
        const normalized = normalizeLayoutPath(layoutPath);
        expect(existsSync(join(target, normalized))).toBe(true);
      }
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("creates docs/references/ directory (M3-AC2)", () => {
    const target = mkdtempSync(join(tmpdir(), "template-render-"));

    try {
      renderTemplate(target, CONTEXT);
      expect(existsSync(join(target, "docs/references"))).toBe(true);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("assigns ownership metadata to every manifest file (M3-AC3)", () => {
    const ownership = getFileOwnershipManifest();
    const filePaths = [...KNOWLEDGE_LAYOUT_ENTRIES, ...CURSOR_ADAPTER_ENTRIES]
      .filter((entry) => entry.kind === "file")
      .map((entry) => entry.path);

    expect(ownership).toHaveLength(filePaths.length);
    expect(new Set(ownership.map((entry) => entry.path))).toEqual(new Set(filePaths));
  });

  it("produces byte-identical output on second render (M3-AC4)", () => {
    const target = mkdtempSync(join(tmpdir(), "template-render-"));

    try {
      renderTemplate(target, CONTEXT);
      const first = readFileSync(join(target, "AGENTS.md"), "utf8");

      renderTemplate(target, CONTEXT);
      const second = readFileSync(join(target, "AGENTS.md"), "utf8");

      expect(second).toBe(first);
      expect(first).toContain("Acme App");
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });

  it("does not generate BACKEND.md or plan template file (M3-AC5)", () => {
    const target = mkdtempSync(join(tmpdir(), "template-render-"));

    try {
      renderTemplate(target, CONTEXT);
      expect(existsSync(join(target, "BACKEND.md"))).toBe(false);
      expect(existsSync(join(target, "docs/plan-template.md"))).toBe(false);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
});
