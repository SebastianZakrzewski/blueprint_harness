# Control Panel architecture

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED
Parent ExecPlan: `../exec-plans/completed/build-harness-platform-v1.1.md`
Implementation gate: `PLATFORM_QUERY_API_READY: PASS`

## Context

Control Panel V1 presents multiple exact-SHA Platform read models without
becoming a second source of truth or coupling feature components to transport,
storage, or authorization implementation.

The panel is a separate application boundary inside the unified Platform V1.1
release.

## Decision

Build a Next.js App Router application using React and strict TypeScript with
four explicit boundaries:

```text
routes and layouts
→ feature modules
→ validated Platform client
→ Platform Read-only Query API
```

Feature modules consume parsed domain values. They do not parse raw HTTP,
query Platform storage, or construct authorization decisions.

## Proposed topology

```text
apps/control-panel/
├── app/
├── components/
│   └── ui/
├── features/
│   ├── project-overview/
│   ├── exec-plans/
│   ├── requirements/
│   ├── validations/
│   ├── snapshots/
│   ├── evidence/
│   ├── architecture-explorer/
│   ├── history/
│   ├── activity/
│   └── governance/
├── lib/
│   ├── platform-client/
│   ├── auth/
│   ├── telemetry/
│   └── routing/
└── tests/
```

The exact paths and package names are pinned at panel activation after the API
gate and verified Blueprint layout are known.

## State ownership

| State | Owner | Examples |
| --- | --- | --- |
| Shareable navigation | URL | project, branch, SHA, snapshot, filters, view |
| Remote state | TanStack Query | read models, pages, freshness, retries |
| Boundary validity | Zod | response metadata and resource payload |
| Ephemeral state | React/React Flow | dialog, selection, viewport |
| Authentication | server-side session | identity and Platform claims |

A general client store is excluded until an evidenced cross-feature state
cannot be represented by URL, remote state, or local state.

## Rendering

- server layouts establish session, navigation, and project context;
- interactive tables, charts, filters, and graphs use client components;
- TanStack Query owns fetching, caching, retry, and background refresh;
- Zod parses every untrusted response;
- TanStack Table owns table behavior with application-owned markup;
- Recharts is limited to bounded charts that communicate more clearly than a
  table;
- server and client components never embed Platform database credentials.

## Authentication and authorization

The panel establishes an OIDC-compatible server session and forwards only the
approved caller context. Platform enforces project and field authorization.

The panel may hide unavailable navigation, but hidden UI is not a security
control. V1 has no write client, administrator backdoor, or direct database
credential.

## Routing identity

Material routes preserve:

```text
project
branch
exact SHA or explicit symbolic input resolved by server
snapshot/comparison identity
view and bounded filters
```

If the requested SHA does not exist, the URL and requested identity remain.
The application never redirects to HEAD as a silent substitute.

## Failure model

| State | Behavior |
| --- | --- |
| `NOT_FOUND` | Preserve identity and show not-found |
| `UNAUTHORIZED` | Return no protected content and explain access |
| `DATA_STALE` | Show last known state, age, watermark, persistent warning |
| `PARTIAL` | Render known sections and enumerate gaps |
| `QUARANTINED` | Block current interpretation and show reason |
| `TEMPORARILY_UNAVAILABLE` | Preserve route and retry within policy |
| `CONTRACT_MISMATCH` | Stop affected feature and expose supported/received versions |

## Observability

Sentry records bounded exceptions, route performance, release identity, and
source maps. Telemetry excludes secrets, raw evidence, protected cross-project
metadata, and hidden reasoning. Project identity is included only where policy
permits it.

## Mechanical boundaries

- feature modules cannot import transport internals;
- no panel package can import Platform persistence or event-store packages;
- raw fetch/HTTP is centralized in the Platform client;
- every query key includes identity fields needed to prevent cross-project/SHA
  cache collision;
- no mutation hook/client for project state exists;
- build-time environment validation rejects database/service credentials not
  permitted to the panel.

## Validation

- contract fixtures for every consumed resource;
- happy, empty, stale, partial, quarantined, unauthorized, not-found,
  unavailable, and mismatch states;
- exact-SHA navigation and refresh;
- query-cache isolation;
- accessibility for navigation, tables, dialogs, and graph fallback;
- Playwright critical journeys;
- dependency tests and secret scanning;
- production build, security headers, release identity, and pilot smoke test.

## References

- Component Product Spec: `../product-specs/harness-control-panel-v1.md`
- Parent Product Spec: `../product-specs/harness-platform-v1.1.md`
- Data contracts: `control-panel-data-contracts.md`
- Explorer: `architecture-explorer-ui.md`
