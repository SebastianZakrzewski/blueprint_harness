# Platform security, reliability, observability, and retention

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Security model

### Identities

- reporters and CI use short-lived workload identity or OIDC;
- humans and agents use project-scoped identities;
- environments have separate identities;
- long-lived static keys are not the default;
- roles cannot self-grant.

### Minimum roles

| Role | Capability |
| --- | --- |
| `platform-reporter` | Ingest approved event types for one project/producer |
| `platform-reader` | Read authorized redacted project state |
| `platform-agent-reader` | Read bounded agent context only |
| `platform-reconciler` | Read approved upstream metadata and append reconciliation facts |
| `platform-verifier` | Evaluate snapshot eligibility; cannot alter source results |
| `platform-revoker` | Append authorized revocation under policy |

The Control Panel uses read-only roles. Client-side hiding is never
authorization.

## Project isolation

Enforce tenant/project filters at:

- identity and authorization;
- ingestion and idempotency;
- event and read-model persistence;
- search and artifact index;
- queries and evidence access;
- logs, traces, fingerprints, retention, and deletion.

Cross-project denial returns no protected metadata.

## Integrity

- authenticated encrypted transport;
- canonical schema, SHA, checksum, timestamp, identity, and authority checks;
- tamper-evident accepted events and manifest identities;
- no caller-controlled artifact location;
- duplicate and replay policy;
- append-only audit for sensitive operations.

## Audit

Record:

- ingestion accept/reject/duplicate/quarantine;
- projector rebuild and reconciliation;
- snapshot verification and revocation;
- policy decision;
- evidence access;
- authorization denial;
- agent context request;
- retention and legal-hold action;
- deployment and rollback identity.

Exclude secrets, raw sensitive evidence, and hidden reasoning.

## Reliability

### Producer delivery

Use durable outbox or CI artifact. Retry with bounded exponential backoff.
Successful source validators are not rerun solely because Platform delivery
failed.

### Reconciliation

Periodically compare Platform with authorized:

```text
Git
CI
criteria registry
ExecPlan manifests
artifact storage
architecture outputs
```

Append `SOURCE_GAP`, repair derivations, or rebuild projections. Do not rewrite
accepted history.

### Outage

```text
source result: preserved
delivery: SYNC_PENDING
Platform query: stale/unavailable
panel: visible degraded state
agent: repository-local fallback
new Platform VERIFIED snapshot: blocked
```

### Deployment

- immutable artifacts;
- separate staging and production;
- database/schema changes use explicit migration and rollback/roll-forward;
- canary or pilot before expansion;
- post-deployment queries and browser smoke tests;
- unknown production state produces `HUMAN_JUDGMENT_REQUIRED`.

## Freshness

Each source has a policy threshold resolved by `PLATFORM-OD-006`. Queries expose
last reconciliation, watermark, source health, and effective freshness.
Staleness alerts differ from project validation failure.

## Observability

Correlate:

```text
tenantId
projectId
eventId
runId
full SHA
producerId
projectionName
reconciliationId
requestId
traceId
releaseId
```

Minimum metrics:

- received/accepted/rejected/duplicate/quarantined envelopes;
- ingestion/query latency and error rates;
- outbox age;
- event-to-projection lag;
- reconciliation age and source gaps;
- stale projects by reason;
- projector rebuild duration/failures;
- artifact integrity/access failures;
- snapshot eligibility outcomes;
- authorization denials;
- context response size/failures;
- panel web vitals and contract mismatches.

## Retention

`PLATFORM-OD-007` defines event, audit, manifest, evidence, quarantine, telemetry,
and activity retention. Legal hold blocks normal deletion. Deletion is
project-scoped, authorized, audited, and never rewrites a historical snapshot
claim as if evidence still existed.

## Recovery tests

- outbox retry and drain;
- Platform outage and recovery;
- projector crash/rebuild;
- stale Git/CI;
- source gap;
- artifact outage;
- migration interruption;
- rollback to prior immutable artifact;
- expired/rotated identity;
- cross-project denial;
- retention with and without legal hold.

## Open decisions

Storage, topology, identity provider, retention, performance targets, and pilot
are resolved in the unified ExecPlan without silently changing Product Specs.

## References

- Evidence: `evidence-packages.md`
- Verification: `snapshot-verification.md`
- Panel architecture: `control-panel-architecture.md`
