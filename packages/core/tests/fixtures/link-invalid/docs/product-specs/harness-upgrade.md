# Harness upgrade

Status: APPROVED  
Verification: NOT_VERIFIED

## User outcome

Adopt a newer Universal Core, template, profile, capability, or policy schema
without silent drift, loss of project knowledge, or unreviewed behavior change.

## Required behavior

An upgrade must:

- inspect the installed lock state and target versions;
- list migrations and compatibility requirements;
- classify affected files by ownership;
- preserve all project-owned files;
- perform controlled three-way comparison for shared files;
- detect local modifications to managed files;
- show every proposed change in a dedicated branch and worktree;
- run Docs, profile, structural, runtime, and reference validation;
- update version and checksum state only after successful migration;
- open a short upgrade PR with rollback and evidence;
- require human approval for normative, permission, security, or autonomy
  changes.

## Forbidden behavior

The system must not:

- update projects silently in the background;
- overwrite Product Specs or Design Docs;
- lower a safety threshold as a compatibility shortcut;
- reset an autonomy freeze;
- replace a project decision with a Blueprint default;
- discard a local managed-file modification without reporting it;
- mark the upgrade complete while reference gates fail.

## Versioning

Core, templates, profiles, capabilities, and policy schemas use explicit
versions. Breaking contract changes require a major version and migration path.
The upgrade report distinguishes functional, configuration, generated,
documentation, security, and permission changes.

## Failure and resume

An interrupted upgrade remains resumable from recorded checkpoints. A failed
upgrade leaves the current installed version operational and provides exact
recovery steps. Partial version metadata may not claim success.

## Acceptance scenarios

1. A mechanical managed-file update produces a clean PR.
2. A project-owned document remains byte-for-byte unchanged.
3. A shared-file conflict is surfaced rather than overwritten.
4. An incompatible profile blocks before target state is committed.
5. A safety-policy change requires explicit human approval.
6. Re-running a completed upgrade produces no unintended diff.
7. Rolling back the upgrade restores the previous verified Harness behavior.
