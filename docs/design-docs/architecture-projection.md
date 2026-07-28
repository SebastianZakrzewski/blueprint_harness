# Architecture projection and drift

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Produce deterministic, bounded, exact-SHA architecture data for validators,
comparisons, agents, and Architecture Explorer without making a diagram the
source of truth.

## Inputs

- approved architecture declarations;
- repository tree and source at one exact SHA;
- AST and import/dependency graphs;
- APIs, events, queues, and database contracts;
- schema representations;
- architecture validator findings;
- generator version and configuration checksum.

Every input is identified or checksummed.

## Projection identity

```text
projectId
+ exact SHA
+ view
+ scope
+ generatorVersion
+ configChecksum
```

Node/edge identity is stable within that projection. Layout coordinates are not
part of the identity.

## Views

| View | Units | Required scope |
| --- | --- | --- |
| MODULE | packages/modules and dependencies | project or subsystem |
| FLOW | APIs, events, queues, stores, external systems | selected flow |
| CONTRACT | API/event/schema and consumers | selected contract/domain |
| CLASS | classes and direct relationships | selected module/path |

Whole-project class projection is forbidden in V1.1.

## Projection contract

```ts
interface ArchitectureProjection {
  projectId: string;
  sha: string;
  projectionId: string;
  view: "MODULE" | "FLOW" | "CONTRACT" | "CLASS";
  scope: ProjectionScope;
  generatorVersion: string;
  configChecksum: string;
  declaredGraph: ArchitectureGraph;
  observedGraph: ArchitectureGraph;
  driftFindings: ArchitectureDriftFinding[];
  generatedAt: string;
  isTruncated: boolean;
  continuationToken?: string;
}
```

Graph nodes and edges retain declaration, code, contract, validation, and
evidence references where authorized.

## Drift

Compare declared and observed graphs:

```text
declared edge absent in code → MISSING_OBSERVED_RELATION
observed undeclared edge → UNDECLARED_RELATION
forbidden reverse dependency → ARCHITECTURE_DRIFT
changed public contract → CONTRACT_DRIFT
unresolvable identity/scope → PROJECTION_PARTIAL
```

Drift never automatically edits documentation or code.

## Determinism

The same canonical inputs yield byte-equivalent canonical projection output,
excluding explicitly volatile generated timestamps. Sort nodes, edges, findings,
and references deterministically before hashing.

## Bounds

Requests declare root/scope, depth, node/edge limits, filters, and view.
Truncation is explicit. Progressive expansion requests another bounded
projection. The server never returns an accidental unbounded repository graph.

## Comparison

HEAD-versus-VERIFIED comparison retains:

```text
baseSha and baseProjectionId
targetSha and targetProjectionId
schema/generator/config compatibility
```

Statuses include unchanged, added, removed, changed, and drifted. Incompatible
or stale inputs block or mark the comparison partial.

## Validation

- exact identity and deterministic rerun;
- valid module, flow, contract, and class scopes;
- unbounded class request rejected;
- undeclared reverse dependency;
- dangling edge;
- parent/group cycle;
- explicit truncation;
- continuation;
- generator/config change;
- HEAD/VERIFIED comparison;
- stale or incompatible comparison.

## References

- Product outcome: `../product-specs/harness-platform-v1.1.md`
- Panel data: `control-panel-data-contracts.md`
- UI rendering: `architecture-explorer-ui.md`
