# ADR-PLATFORM-004: One ExecPlan for Platform and Control Panel

Status: APPROVED
Date: 2026-07-25
Decision owner: project owner
Approval: explicit project-owner instruction to consolidate the plans
Implementation: NOT_IMPLEMENTED

## Context

Platform Core and Control Panel were initially documented as two sequential
active ExecPlans. That model duplicated activation baselines and allowed the
Platform plan to finish before the required first-party browser consumer proved
the Query API end to end.

The components remain technically different:

```text
Platform Core: ingestion, history, read models, verification, API
Control Panel: web UI consuming the API
```

## Decision

Deliver Harness Platform V1.1 and Control Panel V1 through one active ExecPlan:

```text
docs/exec-plans/active/build-harness-platform-v1.1.md
```

Preserve implementation order with an internal gate:

```text
Platform milestones
→ PLATFORM_QUERY_API_READY: PASS
→ panel milestones
→ CONTROL_PANEL_PILOT_READY: PASS
→ HARNESS_PLATFORM_V1_1_GATE: PASS
```

The previous Control Panel ExecPlan becomes a superseded historical record and
is not active.

## Alternatives

- two separate plans: clear component ownership, but duplicates activation and
  final evidence;
- add panel to Blueprint M0–M16: rejected because it changes the already
  approved `1.0.0` foundation scope;
- one plan without internal API gate: rejected because UI could start against
  unstable contracts.

## Consequences

Positive:

- one Blueprint baseline, pilot, decision log, retrospective, and final gate;
- all Platform and panel criteria remain visible in one delivery sequence;
- no cross-plan scope conflict between backend and first-party UI;
- Query API is proven by a real consumer before release closes.

Costs:

- the plan is larger and requires disciplined milestone boundaries;
- Platform V1.1 cannot claim full release completion before panel readiness;
- component teams/agents must coordinate through the same living plan.

## Validation

- exactly one active follow-on plan;
- panel milestones depend on `PLATFORM_QUERY_API_READY`;
- final gate covers all applicable `PLATFORM-AC-*` and `PANEL-AC-*`;
- Blueprint M0–M16 remain unchanged.

## Supersedes

- active `build-harness-control-panel-v1.md`;
- the earlier two-plan activation model.
