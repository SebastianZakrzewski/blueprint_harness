# Execution plans

Status: APPROVED  
Verification: NOT_VERIFIED

## Purpose

An ExecPlan is a self-contained, living execution document for work that cannot
be safely completed from a short ephemeral checklist. It must allow a new agent
to continue the task using only the repository and the plan.

Agents author and maintain plans. The human approves initial complex plans and
material changes until the applicable plan class is explicitly promoted.

## When an ExecPlan is required

Create an ExecPlan when any of the following applies:

- multiple dependent milestones;
- work may take hours or be handed between agents;
- several modules, domains, applications, or infrastructure elements change;
- public API, schema, migration, security, reliability, or architecture changes;
- a significant refactor or difficult rollback is involved;
- implementation uncertainty is expected to produce discoveries;
- incorrect execution could have broad or irreversible impact.

A small, local, reversible change with obvious acceptance may use a lightweight
plan recorded in the task or PR.

## Location and lifecycle

- Active plans: `docs/exec-plans/active/`.
- Completed, abandoned, or partially completed plans:
  `docs/exec-plans/completed/` with an explicit outcome.
- Deliberate non-blocking debt: `docs/exec-plans/tech-debt-tracker.md`.

A plan remains active across milestone PRs. Each PR updates progress and
decisions. The final PR completes the retrospective and moves the plan.

## Writing requirements

- Write for a capable agent with no private conversational context.
- Define repository-relative paths, commands, expected output, and acceptance.
- Explain terms that are specific to the project.
- Record facts and evidence rather than optimistic claims.
- Keep every section current while work proceeds.
- Include exact recovery and idempotence behavior.
- Do not reference a separate template file; use the required structure below.

## Required structure

Copy these headings into every ExecPlan and replace the guidance with concrete
content.

### Purpose / Big Picture

Explain the user-visible or operational outcome, why it matters, and how a
reviewer can observe success.

### Progress

Maintain timestamped, checkable milestones. Distinguish completed, active,
blocked, and remaining work. Update after every material work period and PR.

### Surprises & Discoveries

Record unexpected repository facts, tool behavior, constraints, performance,
test behavior, or assumptions disproved during implementation. Include evidence
and consequence.

### Decision Log

Record each implementation decision, alternatives considered when material,
reason, evidence, owner or approval requirement, and date. Technical plan
adjustments may be made and re-reviewed by the agent. Product behavior, scope,
architecture, API, schema, security, migration, vendor, or irreversible changes
require human reapproval.

### Outcomes & Retrospective

At closure, compare actual outcome with purpose and acceptance. Record what
shipped, what did not, evidence, remaining debt, incidents, and lessons that
should improve the Harness.

### Context and Orientation

Describe relevant modules, domains, layers, existing behavior, repository paths,
and terminology. List `Documentation consulted` and `Invariants applied`.

### Plan of Work

Describe ordered milestones and how each changes the system. Each milestone
must leave the repository working and be independently verifiable.

### Concrete Steps

Provide working directories, exact commands, expected important output, runtime
startup, fixtures, and evidence capture. Commands must be safe to repeat or
state why they are not.

### Validation and Acceptance

List functional, structural, security, reliability, documentation, runtime, CI,
review, and post-deployment checks. Acceptance is stated as observable behavior,
not merely files existing.

### Idempotence and Recovery

Explain safe reruns, interruption, checkpoints, cleanup targets, database and
artifact state, rollback, roll-forward, and escalation. Never use broad or
unresolved destructive targets.

### Artifacts and Notes

Link concise logs, test results, screenshots, traces, schemas, PRs, release IDs,
or other evidence. Do not paste unbounded output or secrets.

### Interfaces and Dependencies

Specify public contracts, domain operations, events, schemas, providers,
external services, package versions, compatibility assumptions, and dependency
direction affected by the work.

## Plan validation

A mechanical linter checks required headings, status, paths, links, progress,
acceptance, recovery, and lifecycle placement. An independent semantic reviewer
returns `PASS`, `REVISE`, or `ESCALATE` based on self-containment, feasibility,
specification alignment, risk, and observability.

## Material change protocol

The agent may update technical detail and record the reason. It stops before
continuing when a discovery would change user behavior, accepted scope,
architecture, public API, schema semantics, security posture, migration risk,
external vendor, or an irreversible action. The revised plan requires human
approval.

## Completion gate

Do not close a plan until acceptance evidence, required tests, current Docs,
clean review, green CI, runtime validation, and outcomes are present. A plan
cannot hide unmet acceptance, security, or data-integrity work in technical
debt.
