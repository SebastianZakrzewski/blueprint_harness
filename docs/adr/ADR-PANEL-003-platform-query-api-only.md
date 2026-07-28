# ADR-PANEL-003: Query API is the panel's only data boundary

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

The panel needs exact-SHA read models, freshness, provenance, evidence links,
and authorization. Direct database access would bypass Platform semantics and
couple presentation to storage.

## Proposed decision

Consume only the versioned Harness Platform V1.1 Read-only Query API. Never
query Platform event/read-model storage directly.

Proposed transport:

```text
REST/JSON over HTTPS
+ versioned OpenAPI
+ generated or owned TypeScript client
+ Zod runtime parsing
```

Transport becomes binding only after `PLATFORM-OD-009` and `PANEL-OD-003`.

## Required behavior

- exact SHA for commit-sensitive state;
- freshness, watermark, provenance, and authorization metadata;
- bounded, deterministic pagination;
- authorized time-bounded evidence retrieval;
- distinct not-found, unauthorized, stale, partial, quarantined, unavailable,
  and contract-mismatch behavior;
- no project-mutating operation for panel credentials.

## Alternatives

- database reads: rejected;
- GraphQL: flexible but unevidenced additional V1 surface;
- RPC only: ecosystem typing with weaker language-neutral contract;
- agent tool transport only: unsuitable as default browser boundary.

## Consequences

- storage can evolve independently;
- API compatibility and source-backed fixtures become a formal internal gate;
- panel degrades independently without affecting Blueprint operations.

## Validation

- dependency scan for database clients;
- OpenAPI/schema compatibility;
- Zod fixtures;
- authorization matrix;
- no mutation operation.

## References

- `../design-docs/control-panel-data-contracts.md`
- `../design-docs/platform-architecture.md`
