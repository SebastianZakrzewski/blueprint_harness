# Architecture decision record index

Status: PROPOSED
Verification: NOT_VERIFIED

| Decision | Purpose | Status |
| --- | --- | --- |
| [ADR-PLATFORM-001](ADR-PLATFORM-001-read-model-not-source-of-truth.md) | Keep Platform projections rebuildable and non-authoritative | PROPOSED |
| [ADR-PLATFORM-002](ADR-PLATFORM-002-control-panel-read-only-v1.md) | Keep Control Panel V1 read-only | PROPOSED |
| [ADR-PLATFORM-003](ADR-PLATFORM-003-preserve-agent-router.md) | Preserve repository-first agent routing | PROPOSED |
| [ADR-PLATFORM-004](ADR-PLATFORM-004-unified-platform-panel-execplan.md) | Deliver Platform and panel through one active ExecPlan | APPROVED |
| [ADR-PANEL-001](ADR-PANEL-001-frontend-stack.md) | Select the panel frontend stack | PROPOSED |
| [ADR-PANEL-002](ADR-PANEL-002-react-flow-and-elk.md) | Render bounded projections with React Flow and ELK.js | PROPOSED |
| [ADR-PANEL-003](ADR-PANEL-003-platform-query-api-only.md) | Keep panel behind the versioned read-only Query API | PROPOSED |

`APPROVED` for ADR-PLATFORM-004 records the explicit project-owner decision to
consolidate delivery. It does not approve unresolved technologies or activate
implementation.

Other `PROPOSED` records are reviewable candidates and become binding only
after required human approval.
