# ADR-PLATFORM-003: Preserve the repository agent router

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

Blueprint uses `AGENTS.md`, repository Docs, and progressive disclosure to
select authoritative context. Replacing this path with Platform search would
make external availability and aggregate state control agent work.

## Proposed decision

Keep repository routing first. Platform adds an optional bounded context read
after task classification and records whether the response was current, stale,
or unavailable.

```text
task
→ repository router
→ relevant Docs/ExecPlan
→ optional Platform context
→ isolated execution
```

Platform context is advisory for navigation and risk. Harness checks and source
evidence remain decisive.

## Alternatives

- Platform-first routing: rejected because outage/staleness could misroute work;
- no agent integration: safe but loses useful aggregate context;
- full repository dump through API: rejected as unbounded and duplicative.

## Consequences

- projects not enrolled in Platform operate unchanged;
- adapter responses must be bounded, exact-SHA, freshness-aware, and authorized;
- agent work continues during Platform outage;
- router decisions record Platform context use.

## Validation

- no Platform configuration;
- current context;
- stale context;
- unavailable Platform;
- unauthorized project;
- router output with and without Platform.

## References

- `../design-docs/agent-platform-integration.md`
- `../design-docs/platform-architecture.md`
