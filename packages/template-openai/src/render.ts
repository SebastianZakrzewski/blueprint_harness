import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getKnowledgeLayoutManifest, KNOWLEDGE_LAYOUT_ENTRIES } from "./manifest.js";
import { CURSOR_ADAPTER_ENTRIES } from "./cursor-adapter.js";
import type { TemplateRenderContext } from "./types.js";

const PACKAGE_ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const TEMPLATES_ROOT = join(PACKAGE_ROOT, "templates");

/**
 * Substitutes `{{key}}` placeholders in template content.
 *
 * @param content - Raw template text.
 * @param context - Render context values.
 * @returns Interpolated content.
 */
export function applyTemplateContext(content: string, context: TemplateRenderContext): string {
  return content
    .replace(/\{\{projectName\}\}/g, context.projectName)
    .replace(/\{\{profileId\}\}/g, context.profileId)
    .replace(/\{\{blueprintVersion\}\}/g, context.blueprintVersion);
}

/**
 * Renders the OpenAI knowledge layout into a target directory.
 *
 * Side effects: creates directories and writes files under targetDir.
 * Invariants: idempotent for the same context (M3-AC4).
 *
 * @param targetDir - Destination repository root.
 * @param context - Template substitution context.
 * @returns List of repository-relative paths written or created.
 */
export function renderTemplate(targetDir: string, context: TemplateRenderContext): string[] {
  const root = resolve(targetDir);
  const created: string[] = [];

  for (const entry of [...getKnowledgeLayoutManifest(), ...CURSOR_ADAPTER_ENTRIES]) {
    const fullPath = join(root, entry.path);

    if (entry.kind === "directory") {
      mkdirSync(fullPath, { recursive: true });
      created.push(entry.path.replace(/\\/g, "/"));
      continue;
    }

    if (!entry.templatePath) {
      throw new Error(`Manifest file missing templatePath: ${entry.path}`);
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

/**
 * Renders the knowledge layout into a temporary directory for smoke testing.
 *
 * @param context - Template substitution context.
 * @returns Absolute path to the temp target directory.
 */
export function renderToTemp(context: TemplateRenderContext): string {
  const tmpRoot = join(PACKAGE_ROOT, "tmp-render-smoke");
  renderTemplate(tmpRoot, context);
  return tmpRoot;
}
