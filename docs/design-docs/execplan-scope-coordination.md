# ExecPlan scope manifests and coordination

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Detect unsafe concurrent work across modules, schemas, APIs, events, policies,
and exclusive resources without treating all path overlap as a conflict.

## Canonical and machine-readable forms

The Markdown ExecPlan remains canonical for purpose, decisions, discoveries,
recovery, progress, and retrospective. A versioned machine-readable scope
manifest is co-located or deterministically associated with it.

The exact format and location are resolved by `PLATFORM-OD-004` against the
verified Blueprint V1 plan-validation contract.

Logical fields:

```text
execPlanId
documentPath
status
owner
baseSha
targetBranch
milestones
criteriaIds
paths
modules
contracts
databaseSurfaces
apiSurfaces
eventSurfaces
policySurfaces
exclusiveResources
dependencies
```

## When conflict detection applies

Conflict detection applies when:

- two plans or milestone scopes are active concurrently; or
- an active plan is based on a stale base and the intervening change overlaps a
  declared semantic surface.

Historical sequential overlap is not itself a conflict.

## Conflict classes

| Class | Example | Default |
| --- | --- | --- |
| Informational | Same docs directory, unrelated specs | Warn |
| Coordinatable | Same public module with compatible split | Require recorded coordination |
| Exclusive | Same migration, schema, policy, release, public contract | Block both scopes |
| Unknown | Missing or ambiguous manifest impact | Block affected work |

Path overlap is a signal. Semantic surfaces decide severity.

## Coordination contract

For compatible concurrent work, record:

```text
coordinationId
plans and milestones
shared surfaces
ownership split
merge order
compatibility contract
required validation
required owners
approvals
expiry or completion condition
```

Every required owner must approve. There is no administrative bypass that
silently clears missing consent.

## Conflict resolution

A blocking conflict closes only when:

1. scopes are separated;
2. plans are serialized with a dependency; or
3. every required owner approves a complete coordination contract.

The resolution is appended with reason, actor, time, and changed scope
identity. Existing conflict history remains visible.

## Unified Platform plan behavior

Platform Core and Control Panel share one release plan, but milestone scopes
remain explicit:

```text
HP1–HP12: Platform contracts, core, API, operations
HP13–HP17: panel and pilot
HP18: combined final gate
```

This avoids a plan-to-plan conflict while preserving internal dependency:
panel milestones are blocked until `PLATFORM_QUERY_API_READY: PASS`.

## Validation fixtures

- concurrent exclusive migration;
- concurrent compatible module split;
- missing coordination approval;
- all owners approve;
- scope separation;
- serialized dependency;
- sequential historical overlap;
- stale base with changed API contract;
- incomplete manifest;
- resolved conflict remains in history.

## References

- Criteria: `criteria-and-impact-model.md`
- Unified plan ADR: `../adr/ADR-PLATFORM-004-unified-platform-panel-execplan.md`
- ExecPlan: `../exec-plans/active/build-harness-platform-v1.1.md`
