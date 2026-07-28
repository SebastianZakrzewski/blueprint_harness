# ADR-PANEL-001: Control Panel V1 frontend stack

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

The panel needs routeable inspection, data tables, bounded charts, architecture
graphs, runtime API parsing, browser tests, accessibility, and production
telemetry. It is a separate application inside the unified Platform V1.1
release, not a frontend in Blueprint M0–M16.

## Proposed decision

Use:

- Next.js App Router, React, strict TypeScript;
- Tailwind CSS and shadcn/ui;
- TanStack Query;
- Zod;
- TanStack Table;
- Recharts;
- Vitest and Testing Library;
- Playwright;
- Sentry.

Use URL parameters for shareable project, branch, exact SHA, snapshot, view,
scope, and filters. Keep ephemeral state local. Do not introduce a general
client store without evidence.

## Alternatives

- Vite SPA: smaller framework surface, more manual auth/layout/runtime assembly;
- heavy data grid: faster initial tables, greater coupling before requirements;
- global store: rejected because state owners are already explicit.

## Consequences

- interactive features use client components where needed;
- every Platform input has a runtime schema;
- versions are pinned only after `PLATFORM_QUERY_API_READY`;
- upgrades test compatibility across graph, monitoring, browser, and deployment.

## Approval gate

Approval does not start code. The unified plan must pass the Blueprint gate,
resolve hosting/identity/API decisions, and then pass the internal API gate
before panel milestones.

## References

- `../design-docs/control-panel-architecture.md`
- `../exec-plans/completed/build-harness-platform-v1.1.md`
