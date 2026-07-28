# Platform V1.1 activation baseline

Status: APPROVED  
Verification: VERIFIED  
Recorded: 2026-07-28  
Milestone: HP0

## Blueprint activation

| Field | Value |
| --- | --- |
| blueprintVersion | `1.0.0` |
| blueprintVerifiedSha | `49f8c560e9e86bdb08ca5ad21f6481cacf3473b8` |
| HARNESS_BLUEPRINT_V1_GATE evidence | `scripts/gates/harness-blueprint-v1-gate.ts`, `tests/gates/negative-scenarios.test.ts`, `docs/exec-plans/completed/build-harness-blueprint-v1.md` |
| policyVersion | `platform-policy-v1` (initial) |
| schema compatibility baseline | `result-envelope@1` (defined at HP2) |
| verified repository structure reference | `pnpm-workspace.yaml`, `packages/*`, `packages/profiles/*` |

## Approved documentation (implementation authority)

| Document | Status at activation |
| --- | --- |
| `docs/product-specs/harness-platform-v1.1.md` | PROPOSED — binding for implementation; human product approval tracked per milestone |
| `docs/product-specs/harness-control-panel-v1.md` | PROPOSED — component spec under Platform release |
| Platform Design Docs (`docs/design-docs/index.md` PROPOSED rows) | PROPOSED — normative for HP1+ |
| `docs/adr/ADR-PLATFORM-004-unified-platform-panel-execplan.md` | APPROVED |
| Other `ADR-PLATFORM-*` / `ADR-PANEL-*` | PROPOSED — resolved at mapped HP milestones |

## Verified package paths (HP0 mapping)

```text
packages/platform-contracts/     → @blueprint-harness/platform-contracts
packages/platform-domain/          → @blueprint-harness/platform-domain
packages/platform-client/          → @blueprint-harness/platform-client
apps/platform-api/                 → @blueprint-harness/platform-api
apps/platform-workers/             → @blueprint-harness/platform-workers
apps/control-panel/                → @blueprint-harness/control-panel
```

Scaffold created at HP1. Control Panel code begins no earlier than HP13.

## Baseline commands (2026-07-28, SHA `49f8c56`)

```text
pnpm install --frozen-lockfile          → exit 0
pnpm exec harness validate-docs         → exit 0
pnpm exec harness check --fast          → exit 0
pnpm run gate                           → HARNESS_BLUEPRINT_V1_GATE: PASS
```

## Open decisions at activation

### Resolved (HP0)

| ID | Decision | Evidence |
| --- | --- | --- |
| PLATFORM-OD-012 | Blueprint gate SHA `49f8c56` | This file; completed Blueprint ExecPlan |
| PLATFORM-OD-001 | Single-tenant deployment per environment; `projectId` isolation in data model | `docs/design-docs/platform-architecture.md` |
| PLATFORM-OD-002 | Local/dev: PostgreSQL via Docker Compose; append-only event tables + read-model DB | `docker/compose.platform.yml` at HP1 |
| PLATFORM-OD-004 | ExecPlan scope manifest: JSON at `.harness/execplan-scope.json`; linter reuses Blueprint ExecPlan headings | HP6 implementation |

### Deferred (target milestone)

| ID | Target HP |
| --- | --- |
| PLATFORM-OD-003 | HP8 |
| PLATFORM-OD-005 | HP4 |
| PLATFORM-OD-006 | HP11 |
| PLATFORM-OD-007 | HP8 / HP11 |
| PLATFORM-OD-008 | HP9 |
| PLATFORM-OD-009 | HP12 |
| PLATFORM-OD-010 | HP18 |
| PLATFORM-OD-011 | HP17 |
| PANEL-OD-001 | HP17 |
| PANEL-OD-002 | HP13 |
| PANEL-OD-003 | HP12 / HP14 |
| PANEL-OD-004 | HP17 |
| PANEL-OD-005 | HP18 |

## Pilot and activation approval

| Field | Value |
| --- | --- |
| pilot project | `fixtures/reference-project` (proposed; confirmed at HP17) |
| activation reviewer | project owner |
| activation decision date | 2026-07-28 |
