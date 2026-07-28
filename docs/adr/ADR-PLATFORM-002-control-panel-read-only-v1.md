# ADR-PLATFORM-002: Control Panel V1 is read-only

Status: PROPOSED
Date: 2026-07-25
Decision owner: project owner
Implementation: NOT_IMPLEMENTED

## Context

The panel displays plans, criteria, validation, snapshots, evidence,
architecture, activity, and policy. Write actions in the same first release
would expand permissions and could turn presentation state into project truth.

## Proposed decision

Control Panel V1 exposes no project-mutating operations. Panel identities can
read authorized Query API resources only.

Excluded:

- editing Docs, criteria, plans, policy, or architecture;
- verifying/revoking snapshots;
- granting autonomy;
- triggering agents, CI, merge, release, deploy, or rollback;
- mutating Platform read models or storage.

## Alternatives

- full administrative control plane: rejected due authority and safety scope;
- limited approvals in V1: deferred because identity and policy semantics must
  first be evidenced through read-only usage;
- direct Git edits: rejected because they bypass repository workflow.

## Consequences

- the first release can prove state fidelity independently of write workflows;
- the panel has no mutation client or database credential;
- future write tools require separate Product Spec, ADR, permissions, audit,
  idempotency, and rollback.

## Validation

- authorization matrix;
- no write routes in public panel client;
- dependency and secret scans;
- attempted mutation returns no reachable operation.

## References

- `../product-specs/harness-control-panel-v1.md`
- `ADR-PANEL-003-platform-query-api-only.md`
