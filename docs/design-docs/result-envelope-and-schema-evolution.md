# Result Envelope and schema evolution

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Define the trustworthy boundary between result producers and Platform
ingestion. TypeScript producer types are insufficient; every supported version
requires canonical serialization and a machine-validatable schema.

## Logical contract

```ts
interface ResultEnvelope {
  schemaVersion: string;
  eventId: string;
  eventType: string;
  projectId: string;
  repositoryId: string;
  branch?: string;
  sha: string;
  run: {
    runId: string;
    attempt: number;
    trigger: string;
    startedAt: string;
    completedAt?: string;
  };
  producer: {
    type: string;
    id: string;
    version: string;
  };
  validation?: {
    validationId: string;
    status: "PASS" | "FAIL" | "ERROR" | "CANCELLED" | "SKIPPED";
    mode: string;
    configChecksum: string;
    policyVersion?: string;
  };
  criteriaIds: string[];
  findings: Finding[];
  artifactReferences: ArtifactReference[];
  observedAt: string;
  payloadHash: string;
}
```

The physical contract is generated or validated from the approved schema
source. The schema file, generated types, examples, and compatibility fixtures
must share one version.

## Boundary sequence

```text
unknown bytes
→ maximum-size and content-type checks
→ schema-version selection
→ signature/identity validation
→ schema parsing
→ canonical serialization
→ payload-hash verification
→ project/repository/SHA validation
→ authorization
→ idempotency decision
→ accept, reject, or quarantine
```

No domain event is produced before required boundary checks pass.

## Idempotency identity

```text
projectId
+ runId
+ attempt
+ eventType
+ producer.id
+ validation.validationId where applicable
+ schemaVersion
```

| Condition | Result |
| --- | --- |
| New identity and valid payload | Accept one source fact |
| Existing identity and same canonical hash | Duplicate acknowledgement; no new domain fact |
| Existing identity and different hash | `INTEGRITY_CONFLICT`; preserve prior accepted event |
| Invalid schema or unauthorized producer | Reject or quarantine with stable reason |
| Unknown or invalid SHA/checksum | Reject or quarantine according to policy |

## Findings and artifacts

Findings use stable IDs, severity, message, optional path, remediation, and
validator identity. Artifact references contain opaque ID, type, checksum,
size, provenance, retention class, and no caller-controlled storage URL.

Secrets, credentials, unnecessary personal data, hidden reasoning, and raw
production rows are forbidden.

## Evolution policy

- Every envelope and event schema has an explicit semantic version.
- Additive compatible changes require compatibility fixtures.
- Renames, semantic changes, or removals require a new supported version.
- Producers and consumers advertise supported versions.
- The compatibility window and removal date are documented before rollout.
- Unsupported versions fail explicitly; they are never coerced to the newest
  schema.
- Stored accepted bytes remain interpretable by a versioned upcaster or archived
  schema implementation.
- Replay tests cover every retained historical version.

## Clock and ordering

Platform retains both producer-observed time and server-received time.
Observation time does not authorize a result and arrival order does not decide
final meaning. Run/attempt/domain identities drive deterministic convergence.

## Local validation

Producers validate envelopes before attempting delivery. Local validation:

- has no remote Platform dependency;
- produces stable finding IDs;
- can persist a durable delivery record;
- does not claim remote acceptance.

## Test matrix

1. minimal valid envelope;
2. full valid validation envelope;
3. invalid schema;
4. unsupported schema version;
5. invalid full SHA;
6. wrong repository/project pair;
7. invalid or missing checksum;
8. unauthorized producer;
9. same duplicate;
10. conflicting duplicate;
11. maximum allowed payload;
12. forbidden sensitive content;
13. previous compatible version;
14. incompatible historical version requiring upcast;
15. out-of-order run events.

## References

- Product invariants: `../product-specs/harness-platform-v1.1.md`
- Ingestion: `event-ingestion-and-projections.md`
- Evidence: `evidence-packages.md`
