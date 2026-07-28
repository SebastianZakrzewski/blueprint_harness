# Design documentation index

Status: APPROVED  
Verification: NOT_VERIFIED

Read only the documents relevant to the active task.

| Document | Purpose | Status | Verification |
| --- | --- | --- | --- |
| [Core beliefs](core-beliefs.md) | Stable agent-first engineering principles | APPROVED | NOT_VERIFIED |
| [Blueprint architecture](blueprint-architecture.md) | Components, package boundaries, profiles, and file ownership | APPROVED | NOT_VERIFIED |
| [Docs ingestion and bootstrap](docs-ingestion-and-bootstrap.md) | Import, mapping, validation, scaffold, and resume behavior | APPROVED | NOT_VERIFIED |
| [Task execution and review loop](task-execution-and-review-loop.md) | Planning, implementation, evidence, reviews, PR, and merge | APPROVED | NOT_VERIFIED |
| [Architecture enforcement](architecture-enforcement.md) | Layer rules, boundary parsing, lints, tests, and taste invariants | APPROVED | NOT_VERIFIED |
| [Worktree and observability](worktree-and-observability.md) | Isolated runtime, application control, and local telemetry | APPROVED | NOT_VERIFIED |
| [Release and autonomy](release-and-autonomy.md) | CI, artifacts, rollout, Sentry, permissions, and promotions | APPROVED | NOT_VERIFIED |
| [Entropy and maintenance](entropy-and-maintenance.md) | Quality grading, gardening, and recurring cleanup | APPROVED | NOT_VERIFIED |
| [Platform architecture](platform-architecture.md) | Platform components, boundaries, dependencies, and unified gates | PROPOSED | NOT_VERIFIED |
| [Result Envelope and schema evolution](result-envelope-and-schema-evolution.md) | Producer identity, parsing, idempotency, and compatibility | PROPOSED | NOT_VERIFIED |
| [Criteria and impact model](criteria-and-impact-model.md) | Criteria registry, dependencies, impact, and progress | PROPOSED | NOT_VERIFIED |
| [ExecPlan scope coordination](execplan-scope-coordination.md) | Active-scope conflicts and coordination contracts | PROPOSED | NOT_VERIFIED |
| [Event ingestion and projections](event-ingestion-and-projections.md) | Append-only history, quarantine, projectors, and rebuild | PROPOSED | NOT_VERIFIED |
| [Snapshot verification](snapshot-verification.md) | VERIFIED eligibility, policy binding, and revocation | PROPOSED | NOT_VERIFIED |
| [Evidence packages](evidence-packages.md) | Immutable manifests, artifacts, sanitization, and retention | PROPOSED | NOT_VERIFIED |
| [Architecture projection](architecture-projection.md) | Exact-SHA graphs, bounds, determinism, and drift | PROPOSED | NOT_VERIFIED |
| [Agent Platform integration](agent-platform-integration.md) | Router-preserving context and result publication | PROPOSED | NOT_VERIFIED |
| [Platform security and reliability](platform-security-reliability-and-retention.md) | Identity, isolation, audit, outage, telemetry, and retention | PROPOSED | NOT_VERIFIED |
| [Control Panel architecture](control-panel-architecture.md) | Frontend boundaries, state, auth, failure, and validation | PROPOSED | NOT_VERIFIED |
| [Control Panel data contracts](control-panel-data-contracts.md) | Parsed Query API resources and projection contract | PROPOSED | NOT_VERIFIED |
| [Architecture Explorer UI](architecture-explorer-ui.md) | React Flow, ELK.js, comparison, accessibility, and bounds | PROPOSED | NOT_VERIFIED |

## Status vocabulary

- `PROPOSED`: reviewable future intent; not binding for implementation.
- `DRAFT`: incomplete and not approved.
- `APPROVED`: normative and binding until superseded.
- `SUPERSEDED`: retained for history and linked to its successor.

## Verification vocabulary

- `NOT_VERIFIED`: implementation evidence does not yet exist.
- `VERIFIED`: current code and tests have been checked against the document.
- `STALE`: evidence or implementation has changed and re-verification is needed.

A status describes authority. Verification describes whether current
implementation evidence supports the document. They are intentionally separate.
