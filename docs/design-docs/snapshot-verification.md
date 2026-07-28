# Snapshot verification and revocation

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Define when one exact project revision may become VERIFIED, how that decision
is reproduced, and how invalidated claims are revoked without rewriting
history.

## State model

```text
UNVERIFIED
→ ELIGIBLE
→ VERIFIED
→ REVOKED
```

`ELIGIBLE` is a derived candidate state, not historical verification.
`VERIFIED` and `REVOKED` are append-only records.

## Identity

```text
snapshotId = hash(
  projectId
  + full SHA
  + policyVersion
  + criteriaRegistryChecksum
  + evidenceManifestHash
)
```

Branch may be recorded as context, but mutable branch identity is not part of
the immutable code revision.

## Eligibility inputs

- allowed project, repository, and branch policy;
- one full exact SHA;
- applicable criteria PASS for that SHA and registry version;
- required global gates PASS;
- required CI and independent review complete;
- milestone and dependency rules pass;
- architecture and security gates pass;
- no unresolved blocking scope conflict;
- complete immutable evidence manifest with valid checksums;
- required sources CURRENT at decision time;
- authorized verifier independent from implementing agent where policy requires.

All local criteria may PASS while the candidate remains UNVERIFIED.

## Verification transaction

1. Load policy, registry, exact-SHA projection, freshness, conflicts, and
   evidence manifest by immutable identity.
2. Recheck authorization and source freshness.
3. Evaluate a versioned decision table.
4. Produce a stable list of satisfied and blocking rules.
5. Append `SnapshotVerified` only on full success.
6. Return the existing snapshot for an identical repeated decision.
7. Append an audit record.

The verifier cannot alter input validations or evidence.

## Global gates

Global gates may include:

- full CI;
- architecture integrity;
- security;
- dependency/milestone completeness;
- scope conflict resolution;
- evidence-package completeness;
- release policy;
- independent review.

Criterion PASS is necessary but not sufficient.

## Policy change

Historical verification remains true under its recorded policy. A new policy
may make the snapshot ineligible for current release:

```text
POLICY_REVALIDATION_REQUIRED
```

That state does not rewrite or revoke history.

## Revocation

Revocation requires:

```text
snapshotId
reasonCode
humanReadableReason
evidenceReferences
revokedAt
revokedBy
policyDecisionId
```

Reasons include corrupted evidence, invalid source identity, material security
or integrity defect, and other explicitly versioned policy reasons.

The original VERIFIED record remains. Current views show effective REVOKED
state with both records and provenance.

## Authority

`PLATFORM-OD-008` resolves authorized roles and the reason catalogue. The
implementing agent cannot verify or revoke its own output without the required
independent authority. Roles cannot self-grant.

## Failure behavior

| Input problem | Result |
| --- | --- |
| Mixed SHA | Block verification |
| Missing or corrupt artifact | Block verification |
| Stale required source | Block and show `DATA_STALE` |
| Unresolved plan conflict | Block |
| Unknown policy/registry version | Block |
| Repeated identical request | Return same snapshot identity |
| Conflicting snapshot identity | Integrity escalation |

## Validation fixtures

- all criteria PASS, global gate incomplete;
- complete verified snapshot;
- mixed SHA;
- missing evidence;
- checksum mismatch;
- stale source;
- unresolved conflict;
- identical repeat;
- policy revalidation;
- authorized revocation;
- unauthorized/self revocation;
- historical view after revocation.

## References

- Criteria: `criteria-and-impact-model.md`
- Evidence: `evidence-packages.md`
- Security authority: `platform-security-reliability-and-retention.md`
