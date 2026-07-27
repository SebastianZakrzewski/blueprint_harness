# Project bootstrap

Status: APPROVED  
Verification: NOT_VERIFIED

## User outcome

Given an empty or approved target repository and approved project Docs, produce
a minimal runnable project foundation, preserve project intent, install the
correct Harness and technology capabilities, validate the result, and open a
complete first PR.

## Primary invocation

```text
npx @sellgenius/harness init --docs ./project-docs
```

## Required behavior

The bootstrap must:

- inspect the target before mutation;
- require or create an anchor commit for safe worktree operation;
- inventory all incoming Docs;
- use existing canonical structure directly when valid;
- generate a proposed manifest when none exists;
- propose mappings for non-canonical Docs;
- request human approval before a mapping changes meaning or authority;
- detect duplicates, conflicts, missing subjects, and unknown documents;
- install the OpenAI knowledge structure and Cursor adapter;
- resolve the minimum compatible Stack Profile capabilities;
- ask when the technology choice is ambiguous;
- generate a minimal runnable scaffold;
- configure isolated local runtime and required checks;
- validate Docs, architecture fixtures, runtime health, and idempotence;
- open a bootstrap PR with evidence and limitations;
- stop for human approval before the initial merge.

## Resume behavior

Bootstrap may be interrupted and re-run. It resumes from the last verified
checkpoint, revalidates assumptions that may have changed, and does not create
duplicates or silently overwrite content.

## Conflict behavior

When approved sources conflict, technology choices are incompatible, or an
existing repository contains overlapping ownership, bootstrap stops with a
clear report and `HUMAN_JUDGMENT_REQUIRED`. It does not resolve normative
conflicts by selecting the most recent-looking text.

## Output report

The user receives:

- source Docs inventory;
- mapping decisions and unresolved items;
- selected profile and capabilities;
- files created, merged, generated, or preserved;
- commands and checks executed;
- environment result;
- gate results;
- known limitations;
- exact next approval required.

## Acceptance scenarios

1. Canonical Docs import without semantic mapping.
2. Non-canonical Docs receive an approved mapping and validate against source.
3. Missing manifest is generated before mapping.
4. Missing frontend creates no frontend scaffold and records NOT_APPLICABLE.
5. Incompatible capabilities block before partial installation.
6. Interrupted bootstrap resumes without duplication.
7. A second completed run produces no unintended diff.
8. The first PR can be understood by an independent agent using repository
   context only.
