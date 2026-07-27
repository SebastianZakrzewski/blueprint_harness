# Technical debt tracker

Status: APPROVED  
Last reviewed: 2026-07-21

This tracker records deliberate, non-blocking debt with evidence and a concrete
remediation trigger. It must never hide unmet acceptance criteria, security
failures, data-integrity risks, or work required to make the current change
correct.

## Active debt

No accepted technical debt has been recorded. The missing implementation and
verification of the Blueprint are planned product work, not accepted debt.

## Entry format

| Field | Requirement |
| --- | --- |
| ID | Stable identifier |
| Status | OPEN, IN_PROGRESS, RESOLVED, or SUPERSEDED |
| Priority | Explicit impact-based priority |
| Area | Domain, package, layer, or operational surface |
| Evidence | Concrete code, test, incident, trace, or quality finding |
| Impact | Current cost or risk |
| Reason accepted | Why deferral is safe and deliberate |
| Remediation | Intended correction |
| Trigger | Date, event, threshold, or dependency that starts repair |
| Owner | Responsible role or automation |
| Exception expiry | Required for temporary Harness exceptions |

Resolved entries remain in history with resolution PR and evidence; they are
not deleted.
