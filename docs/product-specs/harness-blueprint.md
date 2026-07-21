# Harness Blueprint

Status: APPROVED  
Verification: NOT_VERIFIED

## Problem

Designing and delivering production systems repeatedly requires consistent
repository knowledge, planning, implementation controls, runtime validation,
review, release safety, and long-term maintenance. Rebuilding these controls by
memory for every project wastes human attention and makes agent behavior
unpredictable.

## Product outcome

Provide a versioned BASE that can initialize every approved project with an
agent-legible, mechanically enforced engineering environment modeled on the
public OpenAI Harness Engineering approach and adapted to Cursor.

## Primary user

A system architect responsible for client production systems who operates at
the level of business intent, architecture, acceptance, risk, and approval
while retaining the ability to inspect every line and artifact.

## Core value

The user can move from approved project Docs to a runnable, controlled project
quickly, understand what each system mechanism does, and increase agent
autonomy only when the repository supplies objective evidence of readiness.

## Required capabilities

The product must:

- preserve the approved OpenAI repository knowledge layout;
- import canonical Docs without unnecessary remapping;
- generate, propose, validate, and obtain approval for mappings when input Docs
  are non-canonical or lack a manifest;
- create only the technical foundation required by the approved project;
- support technology-neutral Core policy and stack-specific profiles;
- give agents repository-local instructions, tools, runtime access, and
  feedback;
- enforce architecture, boundary validation, legibility, testing, reliability,
  security, and Harness integrity;
- isolate parallel tasks and their mutable resources;
- require living plans for complex work;
- execute self-review, independent review, CI, runtime validation, and feedback
  iteration until clean;
- produce short, complete PRs;
- support controlled merge, staging, production rollout, monitoring, rollback,
  and incident repair;
- provide Sentry-based production feedback without direct production patching;
- measure and promote autonomy separately by capability and risk class;
- automatically freeze or downgrade unsafe autonomy;
- continuously detect and repair entropy through targeted maintenance;
- upgrade itself through controlled PRs without silently overwriting project
  knowledge.

## Knowledge layout

Every generated project retains:

```text
AGENTS.md
ARCHITECTURE.md
docs/design-docs/
docs/exec-plans/active/
docs/exec-plans/completed/
docs/exec-plans/tech-debt-tracker.md
docs/generated/db-schema.md
docs/product-specs/
docs/references/
docs/DESIGN.md
docs/FRONTEND.md
docs/PLANS.md
docs/PRODUCT_SENSE.md
docs/QUALITY_SCORE.md
docs/RELIABILITY.md
docs/SECURITY.md
```

The product must not require an additional `BACKEND.md` or a separate plan
template file.

## Initial supported family

The first base profile supports strict TypeScript on Node.js. The first complete
reference configuration validates NestJS, Mastra, PostgreSQL with Drizzle,
Supabase, local Victoria observability, Sentry, and container delivery.
Frontend support remains optional and is installed only when project Docs
require it.

## Autonomy expectation

The initial state requires human approval for plan, merge, and production.
Agents may eventually plan, implement, review, merge, deploy, monitor, roll back,
and repair policy-compliant changes without routine human intervention. New
business judgment, irreversible risk, destructive data operations, and
unresolved uncertainty remain escalation points.

## Non-goals for V1

- Supporting every language and cloud provider.
- Installing speculative application capabilities.
- Replacing business or architectural judgment with an unrestricted agent.
- Giving agents unrestricted production shell or database access.
- Claiming unpublished implementation details as OpenAI-confirmed.
- Optimizing for code volume instead of verified outcomes.

## Acceptance

- A reference project can be bootstrapped from approved Docs.
- A new agent can navigate it using only repository-local context.
- Deliberate invalid Docs, architecture, runtime, review, release, permission,
  and entropy cases are caught by their stage gates.
- A correct reference change reaches `READY_FOR_MERGE` without false blocking.
- Re-running bootstrap and maintenance is idempotent.
- Autonomy cannot be self-granted or used to bypass mandatory controls.
- The entire reference gate suite passes before V1 release.

## Provenance policy

Every durable claim about the model is classified as OPENAI-CONFIRMED,
RECONSTRUCTED, CURSOR-ADAPTER, or SELLGENIUS-EXTENSION. The product must not
present reconstruction as an unpublished OpenAI implementation detail.
