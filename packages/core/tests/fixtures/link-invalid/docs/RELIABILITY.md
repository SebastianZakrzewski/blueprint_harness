# Reliability

Status: APPROVED  
Verification: NOT_VERIFIED

## Reliability objective

Every operation that can fail must expose enough state for an agent to detect,
diagnose, retry safely, resume, roll back, or escalate. Unknown system state is
not treated as success.

## Local task reliability

- One task owns one isolated worktree environment.
- Startup, status, and teardown are idempotent.
- Database migrations and deterministic seed complete before readiness.
- Health checks cover every required local dependency.
- Cleanup resolves and validates exact owned targets before removal.
- Interrupted tasks resume from recorded plan and environment checkpoints.

## Check reliability

`harness check --fast` supplies rapid local feedback. `harness check --full`
supplies complete pre-review and CI evidence. Both produce stable invariant IDs,
machine-readable results, useful remediation, and non-zero status on blocking
failure.

CI failures are classified before retry. The BASE permits at most two
controlled reruns with preserved evidence. Critical flaky tests never receive a
temporary non-blocking exception.

## Service operation contract

Stack Profiles must provide explicit defaults and project overrides for:

- startup and shutdown;
- health and readiness;
- timeout;
- retry and backoff;
- idempotency;
- concurrency and resource limits;
- queue lease and recovery where applicable;
- external dependency failure;
- graceful degradation;
- structured telemetry.

Retries apply only to operations proven safe to repeat. A retry policy includes
maximum attempts, total time budget, backoff, jitter where appropriate, and
final error semantics.

## Release reliability

Production receives only an immutable artifact built from a verified commit on
`main` and previously tested on staging. The project defines its platform
strategy as canary, blue-green, rolling, or atomic replacement.

Before production, the release report proves:

- artifact identity and checksum;
- staging health;
- smoke and critical-journey results;
- migration classification;
- security checks;
- active observability;
- verified rollback target;
- configured stop thresholds.

## Project-specific release thresholds

The generated project replaces the placeholders below with measured values and
approved rationale before production autonomy.

```text
Critical journeys: UNDEFINED
Maximum approved error rate: UNDEFINED
Maximum latency by journey: UNDEFINED
Maximum relative regression: UNDEFINED
Minimum agent evaluation baseline: UNDEFINED
Canary observation window: UNDEFINED
Full-release observation window: UNDEFINED
Automatic pause conditions: UNDEFINED
Automatic rollback conditions: UNDEFINED
```

Undefined production thresholds block autonomous deployment.

Absolute zero-tolerance conditions always include:

- critical security event;
- data-integrity violation;
- unauthorized access;
- unverified artifact;
- unavailable required monitoring;
- missing rollback target.

## Rollback

Rollback selects the previous verified artifact; it does not rebuild old code.
The action is narrow, audited, routinely exercised, and followed by recovery
verification. Rollback failure triggers `AUTONOMY_FREEZE` and human escalation.

Database changes use expand-contract. A destructive contract step is never an
automatic deployment. If schema state prevents application rollback, the
release is blocked until a safe roll-forward or compatible recovery plan is
approved and tested.

## Sentry response

Production Sentry signals are correlated with release, environment, trace,
request, domain, and operation. Alert rules group identical fingerprints and
start no more than one active repair workflow for the same problem.

Incident severity:

| Severity | Meaning | Initial response |
| --- | --- | --- |
| SEV-1 | Security, data integrity, or unavailable critical function | Pause or rollback immediately; notify human |
| SEV-2 | Major regression affecting many users | Pause rollout; urgent diagnosis and repair |
| SEV-3 | Limited impact with workaround | Automated diagnosis and normal PR |
| SEV-4 | Low impact | Group and schedule evidence-based repair |

Issue resolution requires deployed repair, stable observation window, restored
critical behavior, and updated regression evidence.

## Monitoring failure

If required production monitoring is unavailable:

```text
MONITORING_STATUS: UNAVAILABLE
PRODUCTION_DEPLOYMENT: BLOCKED
AUTONOMY_STATUS: FROZEN
```

The agent may stop rollout or invoke a previously authorized safe rollback. It
may not continue deployment without evidence.

## Recovery evidence

Every release and incident preserves artifact, commit, PR, ExecPlan, policy,
staging results, rollout decisions, telemetry, rollback, and final verification.
Operational secrets and unnecessary personal data are excluded.

## Reliability gates

Before enabling production autonomy, the reference project passes controlled
exercises for staging, progressive rollout, Sentry detection, pause, rollback,
monitoring loss, duplicate incident suppression, regression repair, and
recovery release.
