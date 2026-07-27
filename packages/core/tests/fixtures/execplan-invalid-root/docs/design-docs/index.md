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

## Status vocabulary

- `DRAFT`: not yet an approved source of intent.
- `APPROVED`: normative and binding until superseded.
- `SUPERSEDED`: retained for history and linked to its successor.

## Verification vocabulary

- `NOT_VERIFIED`: implementation evidence does not yet exist.
- `VERIFIED`: current code and tests have been checked against the document.
- `STALE`: evidence or implementation has changed and re-verification is needed.

A status describes authority. Verification describes whether current
implementation evidence supports the document. They are intentionally separate.
