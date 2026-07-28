# ADR-PANEL-002: React Flow and ELK.js for Architecture Explorer

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

Architecture Explorer displays interactive, nested, directed, bounded
projections for an exact SHA. React Flow renders interaction but does not
analyze code or provide the required hierarchical layout.

## Proposed decision

Use `@xyflow/react` for graph interaction and ELK.js for automatic layout:

```text
validated projection
→ typed view adapter
→ ELK.js coordinates
→ React Flow graph
```

Render the same projection as an accessible list/table.

## Alternatives

- Dagre: simpler but weaker for nested, port-aware, multi-edge graphs;
- Mermaid: good static docs, insufficient interactive inspection;
- custom engine: excessive algorithm and maintenance scope.

## Consequences

- Platform owns bounded graph identity, drift, and provenance;
- panel owns view adapter, coordinates, viewport, and layout cache;
- large graphs require progressive scope, performance fixtures, and fallback;
- versions are pinned together at implementation.

## Validation

- deterministic layout fixture;
- graph/list equivalence;
- keyboard and accessibility;
- bounded large graph;
- layout failure fallback.

## References

- `../design-docs/architecture-explorer-ui.md`
- `../design-docs/control-panel-data-contracts.md`
