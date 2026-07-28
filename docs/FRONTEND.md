# Frontend

Status: NOT_APPLICABLE
Verification: NOT_VERIFIED

## Blueprint V1 scope

Harness Blueprint V1 is a CLI, package set, repository template, and automation
system. M0–M16 create no product frontend or empty UI application.

`Status: NOT_APPLICABLE` applies to the Blueprint `1.0.0` implementation only.

## Generated projects

When approved project Docs require a frontend, the resolved Stack Profile adds
the appropriate capability and updates this file with project-specific:

- user-visible acceptance criteria;
- real browser/platform runtime control;
- DOM snapshots/screenshots where applicable;
- console/network inspection;
- accessibility and responsive checks;
- before/after evidence;
- frontend structural and quality invariants.

Cursor Browser is used only when a web frontend exists. API, worker, agentic,
and mobile systems use the appropriate runtime controllers.

## Follow-on Platform V1.1 panel

Control Panel V1 is the first-party web application inside the proposed Harness
Platform V1.1 release. It is not part of Blueprint M0–M16.

Product and design:

- `product-specs/harness-platform-v1.1.md`;
- `product-specs/harness-control-panel-v1.md`;
- `design-docs/control-panel-architecture.md`;
- `design-docs/control-panel-data-contracts.md`;
- `design-docs/architecture-explorer-ui.md`;
- `adr/ADR-PANEL-001-frontend-stack.md`;
- `adr/ADR-PANEL-002-react-flow-and-elk.md`;
- `adr/ADR-PANEL-003-platform-query-api-only.md`.

Delivery uses one plan:

```text
exec-plans/active/build-harness-platform-v1.1.md
```

The panel has no separate active ExecPlan. Its implementation is blocked until:

```text
HARNESS_BLUEPRINT_V1_GATE: PASS
→ Platform milestones
→ PLATFORM_QUERY_API_READY: PASS
```

Only then may the plan create `apps/control-panel/` and update this file's
applicable implementation/verification status for the Platform release. The
Blueprint `1.0.0` frontend status remains historically NOT_APPLICABLE.
