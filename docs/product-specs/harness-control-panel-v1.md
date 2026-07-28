# Harness Control Panel V1

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED
Parent release: Harness Platform V1.1
Delivery plan: `../exec-plans/active/build-harness-platform-v1.1.md`
Internal dependency: `PLATFORM_QUERY_API_READY: PASS`
Supersedes: separate active Control Panel ExecPlan

## Role in the release

Control Panel V1 is the first-party human interface of Harness Platform V1.1.
It remains a separate web application and code boundary, but is implemented,
validated, piloted, and released inside the single Platform V1.1 ExecPlan.

```text
Platform Core
→ stable versioned Read-only Query API
→ Control Panel
```

Panel design may be reviewed before the API is stable. Panel implementation
must not start until the unified plan records:

```text
PLATFORM_QUERY_API_READY: PASS
```

## Problem

Even with Platform read models, users need a consistent way to inspect exact-SHA
state, understand blockers, compare HEAD with VERIFIED, navigate evidence, and
explore architecture without querying databases or reconstructing state from
logs.

## Outcome

Provide a read-only web application for system architects, reviewers, and
operators. It makes Platform state understandable without becoming a second
source of truth or exposing write authority.

## Required modules

| Module | Outcome |
| --- | --- |
| Project Overview | SHA, active plan, blockers, gate state, freshness, HEAD–VERIFIED delta |
| ExecPlans | Active, blocked, and completed plans, dependencies, scope, decisions, progress |
| Requirements and Milestones | Criteria, milestone dependencies, PASS/FAIL/BLOCKED/UNVERIFIED state |
| Validation Center | Runs, findings, global gates, causes, remediation, and evidence |
| HEAD and VERIFIED Snapshots | Exact identities, eligibility, comparison, policy, revocation |
| Evidence Packages | Manifest, checksum, producer, retention, authorized artifact access |
| Architecture Explorer | Scoped module, flow, contract, and class projections with drift |
| History and Comparison | SHA-to-SHA state changes and provenance |
| Runs and Agent Activity | Observable tasks, tools, results, reviews, cost/time where permitted |
| Governance and Settings | Effective policy, approvals, roles, freshness, quarantine, enrollment |

## Scope

- project and branch selection;
- exact SHA or named snapshot selection;
- shareable URL state;
- visible freshness, watermark, provenance, and authorization context;
- bounded, searchable, filterable, paginated tables;
- HEAD-versus-VERIFIED comparison;
- interactive scoped architecture projection;
- authorized evidence previews and links;
- loading, empty, stale, partial, quarantined, unauthorized, not-found,
  contract-mismatch, and unavailable states;
- keyboard navigation and non-graph architecture fallback;
- responsive desktop and reduced mobile view;
- source-backed fixtures, runtime validation, accessibility, and browser tests.

## Non-goals

- editing repository or Platform state;
- approving work, granting autonomy, revoking snapshots, or triggering agents;
- direct database or artifact-store queries;
- deriving truth from client cache or diagram coordinates;
- unbounded logs, evidence, history, or class graphs;
- hidden reasoning, secrets, or protected cross-project metadata;
- implementation within Blueprint M0–M16.

## Invariants

This component applies `PANEL-INV-001` through `PANEL-INV-007` and
`PLATFORM-INV-001`, `PLATFORM-INV-003`, `PLATFORM-INV-004`,
`PLATFORM-INV-007`, `PLATFORM-INV-008`, and `PLATFORM-INV-012` from the parent
Product Spec.

## Technology baseline

| Concern | Proposed choice |
| --- | --- |
| Application | Next.js App Router, React, strict TypeScript |
| Styling/components | Tailwind CSS and shadcn/ui |
| Server state | TanStack Query |
| Runtime parsing | Zod |
| Tables | TanStack Table |
| Architecture graph | React Flow (`@xyflow/react`) |
| Graph layout | ELK.js |
| Charts | Recharts |
| Unit/component tests | Vitest and Testing Library |
| Browser tests | Playwright |
| Monitoring | Sentry |
| Authentication | OIDC-compatible server session with Platform project/RBAC claims |

Shareable selection state belongs in the URL. TanStack Query owns remote
server state. React Flow owns ephemeral interaction state. No general client
store is introduced without evidence.

The proposed transport is REST/JSON over HTTPS with versioned OpenAPI. It
becomes binding only when `PLATFORM-OD-009` and `PANEL-OD-003` are approved.

## Data boundary

```text
raw Platform response
→ schema/version check
→ Zod parsing
→ panel domain value
→ feature component
```

No feature receives unparsed transport data. No production or test code imports
a Platform database client.

Every material response identifies:

```text
schemaVersion
projectId
branch where applicable
exact SHA
generatedAt
event watermark
freshness
provenance
authorization scope
```

## Architecture Explorer

```text
Architecture Projection
→ boundary parsing
→ domain-to-view adapter
→ ELK.js layout
→ React Flow graph
```

Supported bounded views:

- module;
- flow;
- contract;
- class within an explicit module/path scope.

The same validated projection renders as an accessible list or table. The
graph distinguishes declared, observed, added, removed, changed, and drifted
elements and always displays the base and target SHA for comparison.

## Failure behavior

| State | Required behavior |
| --- | --- |
| `NOT_FOUND` | Preserve requested SHA; never fall back to HEAD |
| `UNAUTHORIZED` | Return no protected metadata and explain access boundary |
| `DATA_STALE` | Show last known data, age, watermark, and persistent warning |
| `PARTIAL` | Render known sections and enumerate missing parts |
| `QUARANTINED` | Block current-state interpretation and show stable reason |
| `TEMPORARILY_UNAVAILABLE` | Preserve navigation and retry within policy |
| `CONTRACT_MISMATCH` | Stop affected rendering and show supported/received versions |

Panel or Platform unavailability never changes Blueprint CLI, CI, routing, or
local validation.

## Acceptance

The normative criteria are `PANEL-AC-001` through `PANEL-AC-015` in
`harness-platform-v1.1.md`. The panel component cannot be marked complete
outside the parent final gate.

## Definition of Done

- `PLATFORM_QUERY_API_READY: PASS` is recorded before panel code begins;
- all ten modules use source-backed Platform state;
- panel and agent context show identical state for the selected SHA;
- no write-capable operation or direct storage access exists;
- Architecture Explorer passes deterministic layout, bounds, accessibility,
  comparison, and stale/partial scenarios;
- contract, unit, component, browser, security, and performance checks pass;
- immutable build and pilot deployment are verified;
- `CONTROL_PANEL_PILOT_READY: PASS` is recorded;
- applicable panel criteria are included in
  `HARNESS_PLATFORM_V1_1_GATE: PASS`.

## Open decisions

The normative open decisions are `PANEL-OD-001` through `PANEL-OD-005` in the
parent Product Spec. They are resolved in the unified ExecPlan Decision Log.
