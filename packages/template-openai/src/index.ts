/** Package identity for the OpenAI Repository Template package. */
export const packageIdentity = {
  name: "@blueprint-harness/template-openai",
  version: "0.0.0",
} as const;

export {
  CURSOR_ADAPTER_ENTRIES,
  CURSOR_SURFACE_PATHS,
} from "./cursor-adapter.js";

export {
  KNOWLEDGE_LAYOUT_ENTRIES,
  KNOWLEDGE_LAYOUT_PATHS,
  getFileOwnershipManifest,
  getKnowledgeLayoutManifest,
} from "./manifest.js";

export { applyTemplateContext, renderTemplate, renderToTemp } from "./render.js";
export { renderCursorAdapter } from "./cursor-render.js";

export type { ManifestEntry, TemplateRenderContext } from "./types.js";
