import type { CapabilityDefinition } from "@blueprint-harness/profile-sdk";

/** Capability catalog for typescript-node profile (OD-007 order). */
export const TYPESCRIPT_NODE_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: "base",
    dependsOn: [],
    incompatibleWith: [],
    installOrder: 1,
    providedCommands: ["test", "build"],
    expectedStructuralFixtures: ["src/server.ts", "src/server.test.ts"],
  },
  {
    id: "nestjs",
    dependsOn: ["base"],
    incompatibleWith: [],
    installOrder: 2,
    providedCommands: ["start"],
    expectedStructuralFixtures: ["src/app.module.ts"],
  },
  {
    id: "database",
    dependsOn: ["nestjs"],
    incompatibleWith: [],
    installOrder: 3,
    expectedStructuralFixtures: ["drizzle.config.ts", "src/db/schema.ts"],
  },
  {
    id: "supabase",
    dependsOn: ["database"],
    incompatibleWith: [],
    installOrder: 4,
    expectedStructuralFixtures: ["supabase/config.toml"],
  },
  {
    id: "mastra",
    dependsOn: ["supabase"],
    incompatibleWith: [],
    installOrder: 5,
    expectedStructuralFixtures: ["src/mastra/index.ts"],
  },
  {
    id: "observability",
    dependsOn: ["mastra"],
    incompatibleWith: [],
    installOrder: 6,
    expectedStructuralFixtures: ["docker/observability.compose.yaml"],
  },
];

/** Paths that must not exist when higher capabilities are omitted (M9-AC1). */
export const OMITTED_CAPABILITY_MARKERS: Record<string, readonly string[]> = {
  nestjs: ["src/app.module.ts", "src/main.ts"],
  database: ["drizzle.config.ts", "src/db"],
  supabase: ["supabase"],
  mastra: ["src/mastra"],
  observability: ["docker/observability.compose.yaml"],
};
