import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CURSOR_ADAPTER_ENTRIES } from "./cursor-adapter.js";
import type { TemplateRenderContext } from "./types.js";
import { applyTemplateContext } from "./render.js";

const PACKAGE_ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const TEMPLATES_ROOT = join(PACKAGE_ROOT, "templates");

/**
 * Renders only Cursor adapter surfaces (.cursor/*) into a target directory.
 *
 * @param targetDir - Destination repository root.
 * @param context - Template substitution context.
 * @returns List of repository-relative paths written.
 */
export function renderCursorAdapter(targetDir: string, context: TemplateRenderContext): string[] {
  const root = resolve(targetDir);
  const created: string[] = [];

  for (const entry of CURSOR_ADAPTER_ENTRIES) {
    const fullPath = join(root, entry.path);

    if (entry.kind === "directory") {
      mkdirSync(fullPath, { recursive: true });
      created.push(entry.path.replace(/\\/g, "/"));
      continue;
    }

    if (!entry.templatePath) {
      throw new Error(`Cursor entry missing templatePath: ${entry.path}`);
    }

    const templateFile = join(TEMPLATES_ROOT, entry.templatePath);
    const raw = readFileSync(templateFile, "utf8");
    const rendered = applyTemplateContext(raw, context);

    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, rendered, "utf8");
    created.push(entry.path.replace(/\\/g, "/"));
  }

  return created;
}
