# Evidence packages and artifact index

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Bind a verified claim to immutable, checksum-valid, authorized evidence without
copying unbounded bytes into Platform read models or API responses.

## Storage split

```text
immutable artifact store
  → evidence bytes

Platform event/read model
  → manifest
  → metadata
  → checksum
  → provenance
  → retention/legal-hold state
  → authorized retrieval reference
```

The artifact provider and immutability controls are resolved by
`PLATFORM-OD-003`.

## Manifest

```ts
interface EvidenceManifest {
  manifestVersion: string;
  projectId: string;
  sha: string;
  policyVersion: string;
  criteriaRegistryChecksum: string;
  validators: ValidatorIdentity[];
  configChecksums: string[];
  artifacts: EvidenceArtifact[];
  producerReferences: string[];
  runReferences: string[];
  createdAt: string;
  retentionClass: string;
  redactionStatus: string;
  manifestHash: string;
}
```

Every artifact identifies stable ID, type, checksum, size, MIME type,
provenance, and storage identity controlled by the server.

## Creation sequence

```text
candidate artifacts
→ size/type policy
→ sanitization and data minimization
→ checksum
→ immutable storage
→ storage confirmation
→ canonical manifest
→ manifest hash
→ accepted event and index
```

A failed mandatory sanitizer or checksum verification prevents the artifact
from satisfying verification.

## Sanitization

Reject or redact:

- credentials, API keys, cookies, tokens, and secrets;
- complete production rows where not required;
- unnecessary personal data;
- raw prompts/tool outputs with sensitive content;
- hidden model reasoning;
- unrestricted external URLs;
- screenshots/logs that cannot pass required sanitization.

Redaction records structured findings and the sanitizer version. It cannot
silently claim safe content after a failure.

If stable fingerprints are required, use project-specific HMAC keys in a
dedicated KMS/Secret Manager. Keys are isolated per project and rotated with
retention policy.

## Retrieval

- evidence access is authorized per project and field;
- large content uses bounded preview plus explicit retrieval;
- links are short lived or resolved through an authorized service;
- access is audited;
- callers never choose arbitrary storage locations;
- unauthorized users may see that evidence exists only when metadata policy
  permits it.

## Retention and legal hold

`PLATFORM-OD-007` defines retention by evidence/audit class. A manifest remains
at least as long as its snapshot record. Legal hold prevents ordinary deletion.
Deletion appends an auditable retention action; it does not make an active
verification claim appear complete if required bytes are gone.

## Supersession

New evidence may supersede prior evidence through a new identity and manifest.
Bytes or metadata are never silently replaced under the same checksum/identity.

## Validation

- valid complete manifest;
- missing required artifact;
- checksum mismatch;
- immutable write failure;
- sanitizer success and failure;
- secret fixture;
- unauthorized access;
- expired link;
- bounded preview;
- retention expiry;
- legal hold;
- superseded evidence;
- cross-project access denial.

## References

- Snapshot binding: `snapshot-verification.md`
- Security and retention: `platform-security-reliability-and-retention.md`
- Panel presentation: `control-panel-data-contracts.md`
