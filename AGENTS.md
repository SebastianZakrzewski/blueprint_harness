# Agent entry point

This repository is operated through an agent-first engineering harness.
Humans define intent, acceptance criteria, risk tolerance, and decisions that
require judgment. Agents plan, implement, validate, review, document, and
operate changes inside the repository's enforced boundaries.

## Start every task here

1. Read this file.
2. Classify the task and its risk.
3. Open only the relevant documentation listed below.
4. Record `Documentation consulted` and `Invariants applied` in the plan or PR.
5. Establish the current baseline before changing anything.
6. Use one isolated worktree and environment for one task or ExecPlan.
7. Follow the complete validation and review loop.
8. Escalate when human judgment is required.

Do not treat this file as an encyclopedia. It is a map to the repository's
versioned sources of truth.

## Repository map

| Need | Source of truth |
| --- | --- |
| System boundaries and package layering | `ARCHITECTURE.md` |
| Product behavior and acceptance | `docs/product-specs/index.md` |
| Technical design and core beliefs | `docs/design-docs/index.md` |
| Planning and ExecPlan requirements | `docs/PLANS.md` |
| Active and completed execution history | `docs/exec-plans/` |
| Product decision principles | `docs/PRODUCT_SENSE.md` |
| Design conventions | `docs/DESIGN.md` |
| Frontend applicability and rules | `docs/FRONTEND.md` |
| Reliability, release, and recovery | `docs/RELIABILITY.md` |
| Security and production permissions | `docs/SECURITY.md` |
| Quality and autonomy readiness | `docs/QUALITY_SCORE.md` |
| Generated database representation | `docs/generated/db-schema.md` |
| External technical references | `docs/references/` |
| Platform V1.1 product behavior and combined release acceptance | `docs/product-specs/harness-platform-v1.1.md` |
| Platform ingestion, state, verification, API, and operational design | `docs/design-docs/platform-architecture.md` and linked Platform Design Docs |
| Control Panel behavior, API boundary, and Architecture Explorer | `docs/product-specs/harness-control-panel-v1.md` and linked panel Design Docs |
| Unified Platform and Control Panel delivery | `docs/exec-plans/active/build-harness-platform-v1.1.md` |
| Platform and panel architecture decisions | `docs/adr/index.md` |

## Task classification

Use a lightweight plan only for a small, local, reversible change with obvious
acceptance criteria. Create or update an ExecPlan when work is multi-stage,
cross-domain, long-running, architectural, migration-related, security- or
reliability-sensitive, difficult to reverse, or likely to be handed between
agents.

An ExecPlan must comply with `docs/PLANS.md` and live in
`docs/exec-plans/active/` until its complete outcome is verified.

Work affecting Harness Platform V1.1 or Control Panel V1 is governed by the
single unified Platform ExecPlan. The panel must not create a second active
delivery plan. Panel milestones remain blocked until the plan records
`PLATFORM_QUERY_API_READY: PASS`.

## Required task loop

1. Confirm intent, scope, acceptance criteria, and risk class.
2. Read the routed documentation and inspect the actual code.
3. Create or update the appropriate plan.
4. Validate the baseline with the relevant checks.
5. Start the isolated worktree environment.
6. Implement one coherent, reviewable milestone.
7. Run `harness check --fast` after coherent edits.
8. Drive the real application or runtime where behavior changes.
9. Self-review the diff against intent and acceptance criteria.
10. Request an independent reviewer and required specialist reviewers.
11. Resolve every actionable finding; never silently dismiss it.
12. Run `harness check --full` and CI.
13. Update documentation, diagrams, plan progress, and evidence.
14. Produce a short, complete PR and a merge-readiness report.
15. Merge or deploy only when the active autonomy policy permits it.
16. Verify the result after merge and, when applicable, after deployment.

## Core commands

```text
harness inspect
harness validate-docs
harness check --fast
harness check --full
harness env up
harness env status
harness env down
harness autonomy status
```

Commands may be unavailable before the initial scaffold is implemented. The
first implementation ExecPlan must establish them incrementally and record the
validated alternative used at each milestone.

## Non-negotiable invariants

- Repository-local, versioned artifacts are the operational source of truth.
- External input is parsed and validated at system boundaries.
- Domain and layer dependency directions in `ARCHITECTURE.md` are enforced.
- Production code is legible, proportionally abstracted, and explicitly named.
- Named production functions carry useful human-readable contract documentation.
- Tests demonstrate externally meaningful behavior and regression protection.
- Structured logs contain correlation identifiers and never expose secrets.
- Agents may not disable checks, weaken assertions, or edit CI to bypass failure.
- Production changes flow through worktree, PR, CI, immutable artifact, and release pipeline.
- An agent may recommend higher autonomy but may never grant it to itself.
- Automatic downgrade and `AUTONOMY_FREEZE` are always permitted protective actions.

## Human judgment required

Stop and report `HUMAN_JUDGMENT_REQUIRED` for unclear product intent, conflicting
approved documents, material scope or behavior changes, new architectural
boundaries, destructive migrations, irreversible data operations, security or
legal tradeoffs, missing rollback, unknown production state, or any action not
authorized by the current policy.

## Documentation maintenance

Update the corresponding diagram in the same PR when changing system
boundaries, layer dependencies, component communication, deployment topology,
or a critical data flow. Normative changes require approval. Mechanically
verifiable descriptive drift may be repaired by a documentation gardener.

## Completion

A task is not complete at code generation. Completion requires passing checks,
runtime evidence where applicable, independent review, current documentation,
an accurate living plan, and verified post-merge or post-deployment behavior.
