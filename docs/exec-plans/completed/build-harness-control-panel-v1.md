# Build Harness Control Panel V1 — superseded plan record

Status: SUPERSEDED
Original plan ID: `build-harness-control-panel-v1`
Created: 2026-07-25
Superseded: 2026-07-25
Implementation started: false
Implementation completed: false
Superseded by: `../completed/build-harness-platform-v1.1.md`
Decision: `../../adr/ADR-PLATFORM-004-unified-platform-panel-execplan.md`

## Purpose / Big Picture

This record preserves the disposition of the earlier separate Control Panel
ExecPlan. No panel implementation was performed under it.

The product scope, invariants, criteria, design, and proposed technology remain
available in the canonical component Product Spec and Design Docs. Delivery was
consolidated into the single Platform V1.1 ExecPlan.

## Progress

| Phase | Outcome |
| --- | --- |
| Documentation design | Completed as proposed documentation |
| Activation | Never activated |
| Implementation | Never started |
| Validation/release | Not performed |
| Consolidation | Completed by ADR-PLATFORM-004 |

## Surprises & Discoveries

The panel depends on stable Platform contracts, but that dependency can be an
internal gate in one release plan. A separate plan duplicated baseline,
decision, pilot, and final evidence management.

## Decision Log

| ID | Date | Decision |
| --- | --- | --- |
| PANEL-SUPERSEDE-001 | 2026-07-25 | Move delivery into `build-harness-platform-v1.1.md` |
| PANEL-SUPERSEDE-002 | 2026-07-25 | Preserve panel Product Spec, Design Docs, ADR IDs, invariant IDs, and acceptance IDs |

## Outcomes & Retrospective

No code or runtime artifact shipped. No acceptance criterion was claimed.

The useful outcome is a simpler release model:

```text
one Blueprint baseline
→ one Platform/API sequence
→ one panel sequence
→ one combined final gate
```

## Context and Orientation

Canonical successors:

- `../../product-specs/harness-platform-v1.1.md`;
- `../../product-specs/harness-control-panel-v1.md`;
- `../../design-docs/control-panel-architecture.md`;
- `../../design-docs/control-panel-data-contracts.md`;
- `../../design-docs/architecture-explorer-ui.md`;
- `../active/build-harness-platform-v1.1.md`.

## Plan of Work

No remaining work is authorized by this record. Continue only through the
successor plan and its `PLATFORM_QUERY_API_READY` internal gate.

## Concrete Steps

None.

## Validation and Acceptance

Verify:

- this record is outside `active/`;
- exactly one active Platform/panel plan exists;
- all prior requirement identifiers are preserved;
- no implementation claim was created.

## Idempotence and Recovery

If this file is accidentally restored to `active/`, move it back to
`completed/` and validate plan uniqueness. Do not create a second active plan.

## Artifacts and Notes

No implementation artifacts.

## Interfaces and Dependencies

Superseded by the unified Platform V1.1 ExecPlan.
