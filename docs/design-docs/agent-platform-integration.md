# Agent and Platform integration

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Let authorized agents read bounded aggregated context and publish observable
results without replacing repository routing, approved Docs, isolated
worktrees, checks, or independent review.

## Preserved execution path

```text
task
→ agent adapter
→ AGENTS.md and repository router
→ relevant Docs and active ExecPlan
→ optional Platform context read
→ isolated worktree
→ implementation
→ Harness checks and CI
→ evidence publication
```

Platform adds optional edges before and after work. It does not become the
agent's primary router or permission authority.

## Context request

The router or approved adapter supplies:

```text
project and repository identity
selected branch and exact SHA
task classification
requested context categories
maximum size/count
caller role and authorization scope
```

The response may contain:

- last verified snapshot;
- active plan and allowed scope;
- applicable criteria and invariants;
- required validations;
- affected modules and contracts;
- active conflicts;
- recent relevant failures;
- freshness and provenance.

It must not contain unrelated project data, unbounded source/logs, secrets,
production rows, hidden reasoning, or write authority.

## Freshness behavior

| Platform state | Agent behavior |
| --- | --- |
| `CURRENT` | May use bounded context as advisory navigation evidence |
| `SYNC_PENDING` | Use local sources; record pending state |
| `DATA_STALE` | Must not treat context as current |
| unavailable | Continue repository-first and record `PLATFORM_CONTEXT_UNAVAILABLE` |
| integrity conflict | Stop any action relying on disputed Platform state |

Repository Docs and exact local code remain decisive.

## Result publication

After local or CI validation:

1. preserve the canonical source result;
2. build and locally validate Result Envelope;
3. place it in durable outbox or CI artifact;
4. attempt authenticated delivery;
5. record accepted, duplicate, pending, rejected, or quarantined outcome;
6. never rerun a successful validator merely to retry transport.

## Observable activity

Platform may record:

```text
actor and role
task/plan/milestone
branch, base SHA, resulting SHA
worktree identity
bounded tool/operation names
changed paths
validations and results
review disposition
time, duration, and permitted cost
artifact and escalation references
```

It must not request or store chain-of-thought.

## Permission boundary

An agent reader cannot ingest, verify, revoke, change policy, or access another
project. A reporter cannot read project state. An implementing agent cannot
self-verify.

## Validation

- context requested after repository routing;
- context exact-SHA identity;
- bounded response;
- stale response rejected as current;
- Platform outage fallback;
- unauthorized project;
- reporter/reader role separation;
- durable result delivery retry;
- activity without hidden reasoning;
- router decision records whether context influenced planning.

## References

- Router preservation ADR: `../adr/ADR-PLATFORM-003-preserve-agent-router.md`
- Result contract: `result-envelope-and-schema-evolution.md`
- Security: `platform-security-reliability-and-retention.md`
