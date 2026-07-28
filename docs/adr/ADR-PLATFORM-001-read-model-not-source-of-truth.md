# ADR-PLATFORM-001: Platform read models are not sources of truth

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

Platform aggregates Git, Docs, ExecPlans, CI, validators, and evidence. If its
database becomes authoritative for these facts, repository-first operation and
rebuildability are lost.

## Proposed decision

Keep authoritative sources explicit. Accepted Platform events preserve
operational history; current read models are deterministic, disposable
projections with provenance, watermark, and freshness.

```text
authoritative source
→ accepted fact
→ projector
→ read model
```

Read models cannot manually override source validation, criterion state,
policy, or snapshot eligibility.

## Alternatives

- mutable database records as truth: rejected because repairs rewrite history;
- querying every upstream source at request time: rejected for latency,
  availability, and inconsistent point-in-time state;
- Git only with no aggregate model: preserves truth but does not solve
  operational inspection and cross-project scale.

## Consequences

- projection rebuild and schema evolution are mandatory;
- every material API response exposes provenance and freshness;
- Platform may be stale while repository-local truth remains valid;
- current state can be optimized without losing historical facts.

## Validation

- delete and rebuild read models;
- compare canonical output;
- projector failure leaves events intact;
- manual read-model mutation is impossible or detected.

## References

- `../design-docs/platform-architecture.md`
- `../design-docs/event-ingestion-and-projections.md`
