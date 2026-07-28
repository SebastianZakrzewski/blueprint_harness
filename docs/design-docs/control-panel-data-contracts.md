# Control Panel data contracts

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Define the parsed boundary between the versioned Query API and panel features.
Compile-time TypeScript types do not make network input trustworthy.

## Common metadata

```ts
type FreshnessStatus =
  | "CURRENT"
  | "SYNC_PENDING"
  | "DATA_STALE"
  | "SOURCE_GAP"
  | "INTEGRITY_CONFLICT";

interface QueryMetadata {
  schemaVersion: string;
  projectId: string;
  branch?: string;
  sha: string;
  generatedAt: string;
  eventWatermark: string;
  freshness: FreshnessStatus;
  provenanceReferences: string[];
  authorizationScope: string[];
}
```

`sha` is full and exact. A symbolic input such as HEAD is allowed only when the
response returns the exact resolved SHA and observation metadata.

## Response envelope

Each endpoint maps into:

```ts
type QueryResult<T> =
  | { kind: "ok"; metadata: QueryMetadata; data: T }
  | { kind: "partial"; metadata: QueryMetadata; data: T; gaps: DataGap[] }
  | { kind: "not-found"; requestedIdentity: RequestedIdentity }
  | { kind: "unauthorized" }
  | { kind: "quarantined"; reasonCode: string; metadata?: QueryMetadata }
  | { kind: "unavailable"; retryAfter?: string }
  | {
      kind: "contract-mismatch";
      supportedVersions: string[];
      receivedVersion?: string;
    };
```

The transport adapter maps status codes and raw bodies into this panel-domain
union after runtime parsing. Feature components do not inspect arbitrary error
objects.

## Required resources

The `PLATFORM_QUERY_API_READY` gate supplies approved schemas and fixtures for:

- projects and branches;
- overview;
- criteria and milestones;
- ExecPlans, dependencies, scopes, and conflicts;
- validations and findings;
- snapshots and comparisons;
- evidence manifests and authorized links;
- architecture projections;
- runs and activity;
- governance and effective policy;
- freshness and quarantine;
- bounded agent context equivalence fixtures.

Lists include cursor/page metadata and deterministic order definition.

## Architecture contract

```ts
type ArchitectureView = "MODULE" | "FLOW" | "CONTRACT" | "CLASS";

type ArchitectureNodeType =
  | "PACKAGE"
  | "MODULE"
  | "CLASS"
  | "API"
  | "EVENT"
  | "DATABASE"
  | "QUEUE"
  | "EXTERNAL_SYSTEM";

type ArchitectureEdgeType =
  | "IMPORT"
  | "CALL"
  | "DEPENDENCY"
  | "DATA_FLOW"
  | "PUBLISHES"
  | "CONSUMES"
  | "READS"
  | "WRITES";

type ProjectionOrigin = "DECLARED" | "OBSERVED" | "BOTH";
type ComparisonStatus = "UNCHANGED" | "ADDED" | "REMOVED" | "CHANGED";

interface ArchitectureNode {
  id: string;
  type: ArchitectureNodeType;
  name: string;
  path?: string;
  parentId?: string;
  origin: ProjectionOrigin;
  comparisonStatus?: ComparisonStatus;
  contractReferences: string[];
  evidenceReferences: string[];
  metadata: Record<string, string | number | boolean | null>;
}

interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type: ArchitectureEdgeType;
  origin: ProjectionOrigin;
  comparisonStatus?: ComparisonStatus;
  evidenceReferences: string[];
}

interface ArchitectureDriftFinding {
  id: string;
  severity: "ERROR" | "WARNING" | "INFO";
  message: string;
  nodeIds: string[];
  edgeIds: string[];
  declarationReferences: string[];
  evidenceReferences: string[];
}

interface ArchitectureProjection {
  metadata: QueryMetadata;
  projectionId: string;
  view: ArchitectureView;
  scope: {
    rootId?: string;
    depth: number;
    nodeLimit: number;
    edgeLimit: number;
    appliedFilters: Record<string, string[]>;
  };
  generatorVersion: string;
  configChecksum: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  driftFindings: ArchitectureDriftFinding[];
  isTruncated: boolean;
  continuationToken?: string;
}
```

## Projection validation

- edge endpoints resolve to returned nodes or declared boundary placeholders;
- `parentId` cannot form a cycle;
- node/edge IDs are unique;
- scope limits are positive and within approved maximums;
- class view has an explicit bounded root;
- evidence references are opaque;
- truncation is explicit;
- unsupported versions produce contract mismatch;
- no unknown enum is silently coerced.

## Comparison identity

```ts
interface ArchitectureComparisonIdentity {
  projectId: string;
  baseSha: string;
  targetSha: string;
  baseProjectionId: string;
  targetProjectionId: string;
  generatedAt: string;
}
```

Both identities stay visible. Two SHAs are never merged into an unlabeled
single state.

## React Flow mapping

```text
ArchitectureNode → Node<ArchitectureNodeData>
ArchitectureEdge → Edge<ArchitectureEdgeData>
```

ELK.js adds view-only coordinates. Coordinates, viewport, selection, and
filters are not sent back as Platform architecture facts.

## Contract generation

The approved transport may generate a TypeScript client, but Zod/runtime
schemas remain the trust boundary. Generated output is pinned to exact schema
version/checksum and reruns with no unintended diff.

## Validation scenarios

1. current valid resource;
2. stale resource;
3. partial resource;
4. not found;
5. unauthorized;
6. quarantined;
7. unavailable;
8. unsupported schema;
9. requested SHA mismatch;
10. cross-project cache collision attempt;
11. valid projection;
12. dangling edge;
13. parent cycle;
14. explicit truncation;
15. comparison identities;
16. unauthorized evidence omitted;
17. maximum bounded graph.

## References

- Platform projection: `architecture-projection.md`
- Panel architecture: `control-panel-architecture.md`
- Query-only ADR: `../adr/ADR-PANEL-003-platform-query-api-only.md`
