/** Context substituted into knowledge layout templates during render. */
export interface TemplateRenderContext {
  projectName: string;
  profileId: string;
  blueprintVersion: string;
}

/** A single manifest entry for a file or directory in the knowledge layout. */
export interface ManifestEntry {
  path: string;
  kind: "file" | "directory";
  ownershipClass: "BLUEPRINT_MANAGED" | "PROJECT_OWNED" | "MERGE_CONTROLLED" | "GENERATED";
  templatePath?: string;
}
