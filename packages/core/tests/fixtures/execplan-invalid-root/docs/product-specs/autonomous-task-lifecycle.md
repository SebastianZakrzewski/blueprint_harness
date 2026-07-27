# Autonomous task lifecycle

Status: APPROVED  
Verification: NOT_VERIFIED

## User outcome

Describe a desired change at a high level and receive a verified, documented,
reviewed result while retaining visibility into code, evidence, decisions, and
risk. Increase independence only after the repository proves it can safely
support it.

## Required lifecycle

For every task, the system must:

1. identify intent, scope, acceptance, and risk;
2. consult the relevant repository Docs;
3. create the appropriate lightweight plan or ExecPlan;
4. establish the current baseline;
5. create an isolated worktree environment;
6. implement one coherent milestone;
7. validate the real runtime where behavior changes;
8. self-review and obtain independent review;
9. run required specialist reviews and CI;
10. iterate until no actionable finding remains;
11. update Docs, diagrams, plan, and evidence;
12. produce a short complete PR and readiness report;
13. merge only when the current policy permits it;
14. verify `main`, staging, and production where applicable;
15. roll back or repair when observed behavior violates release criteria;
16. close the plan only when the complete outcome is evidenced.

## Human visibility

The user can inspect:

- every changed line;
- the plan and decision history;
- consulted Docs and applied invariants;
- tests and reviewer findings;
- runtime evidence;
- CI and release results;
- production signals and rollback actions;
- the reason for any escalation.

The workflow must not require line-by-line human review to operate safely at a
promoted autonomy level.

## Required escalation

The agent stops when product intent is ambiguous, approved sources conflict, a
material scope or architecture change is needed, security or legal judgment is
required, data destruction is possible, rollback is unavailable, production
state is unknown, or the policy does not authorize the action.

## Production response

A qualifying production issue may start automated triage and an isolated repair
workflow. The system must reproduce the issue or state that reproduction is not
confirmed, add regression protection, deliver a normal reviewed change, and
verify the new release. Direct production patching is prohibited.

## Autonomy growth

Plan approval, merge, staging, production, rollback, and incident response are
promoted separately. The agent can recommend promotion from objective evidence,
but only a human approves it. Unsafe evidence automatically freezes or reduces
autonomy.

## Acceptance scenarios

1. A valid small task reaches a clean PR without unnecessary context loading.
2. A complex task remains resumable by a new agent through its ExecPlan.
3. A deliberate architectural violation is caught before merge.
4. A reviewer finding causes correction and repeat validation.
5. A critical flaky test blocks rather than being hidden.
6. A promoted low-risk change may auto-merge while production remains manual.
7. A promoted production change rolls out, observes, and verifies autonomously.
8. A simulated regression pauses, rolls back, creates one repair workflow, and
   returns through the normal PR path.
9. A destructive operation requests human judgment even at the highest level.
