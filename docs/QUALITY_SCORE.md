# Quality score

Status: APPROVED  
Verification: VERIFIED (V1 gate 2026-07-28)  
Last evidence review: 2026-07-28 (HARNESS_BLUEPRINT_V1_GATE: PASS)

## Scale

| Grade | Meaning |
| --- | --- |
| A | Strong, mechanically enforced controls with current complete evidence |
| B | Good controls with small, explicit, non-critical gaps |
| C | Functional but missing important controls or evidence |
| D | Significant risk or recurring deviation |
| F | Unsafe or below the minimum required standard |
| N/A | The area is intentionally absent |
| UNVERIFIED | Evidence is insufficient to assign a grade |

Grades are evidence claims, not opinions. A high grade requires links to current
tests, lints, structural checks, runtime validation, release results, audits, or
incident evidence.

## Current Blueprint score

V1 implementation milestones M0–M16 completed. Evidence: `pnpm test`, `pnpm gate`,
GitHub CI workflows, and gate logs in `scripts/gates/harness-blueprint-v1-gate.ts`.

| Area | Grade | Current evidence | Blocking gap |
| --- | --- | --- | --- |
| Repository knowledge | B | `validate-docs`, ExecPlan linter, gate G1/G2 | npm publication policy (OD-001) |
| CLI and Universal Core | B | 55+ core tests, CLI commands, gate PASS | Production deploy not exercised |
| Profile SDK | B | Contract + resolution tests | Additional profile fixtures deferred |
| TypeScript Node profile | B | Capabilities, arch lints, observability scaffold | Production profile hardening |
| Architecture enforcement | B | Arch/structural lints integrated in `check` | Taste invariants still human-reviewed |
| Worktree isolation | B | `tests/gates/two-worktree-isolation.test.ts`, gate G4 | Live Docker isolation optional |
| Local observability | B | OD-003 pins, telemetry provider, query gate | Live Vector/Victoria stack optional in CI |
| Review and CI | B | `.github/workflows`, merge-readiness report | Third-party CI runner variance |
| Release and rollback | B | Staging artifact model, gate G7 | Production rollout thresholds undefined (OD-008) |
| Security and permissions | B | Permission-boundary + autonomy freeze gates | Production permission matrix |
| Maintenance automation | B | Gate G5 entropy artifacts, debt tracker | Scheduled automations not deployed |

## Critical caps

- Security F makes the affected area F.
- Data Integrity F makes the affected area F.
- Missing critical-journey regression tests caps an area at C.
- Missing production observability caps a production area at C.
- Untested rollback caps a deployable area at C.
- Missing evidence produces UNVERIFIED, not an optimistic grade.

## Domain and layer matrix

The Blueprint package implementation has not yet been scaffolded. The first
implementation ExecPlan must replace this placeholder with the actual package
and semantic-layer matrix and evidence.

| Domain or package | Types | Config | Repo | Service | Runtime | UI |
| --- | --- | --- | --- | --- | --- | --- |
| Harness Core | UNVERIFIED | UNVERIFIED | N/A | UNVERIFIED | UNVERIFIED | N/A |
| CLI | UNVERIFIED | UNVERIFIED | N/A | UNVERIFIED | UNVERIFIED | N/A |
| Template | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | N/A |
| Profile SDK | UNVERIFIED | N/A | N/A | UNVERIFIED | UNVERIFIED | N/A |
| Upgrade Engine | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | N/A |

## Autonomy readiness

```text
Current level: A0 (enforced default)
PLAN: HUMAN_APPROVAL
MERGE: HUMAN_APPROVAL
STAGING: A0 (local staging gate allowed per OD-008)
PRODUCTION: BLOCKED (UNDEFINED thresholds)
ROLLBACK: HUMAN_APPROVAL
INCIDENT_RESPONSE: HUMAN_APPROVAL
AUTONOMY_PROMOTION: BLOCKED (self-promotion triggers AUTONOMY_FREEZE)
```

### Missing evidence

- Production rollout thresholds remain UNDEFINED (OD-008).
- npm publication policy remains UNDEFINED (OD-001).
- Independent human V1 release tag approval (G10) pending outside automation.

## Change history format

Every grade change records:

```text
Area:
Previous grade:
New grade:
Evidence added or invalidated:
Reason:
Verification date:
Independent reviewer:
```

An implementer may add evidence but cannot unilaterally raise the grade. The
Quality Auditor and an independent reviewer validate increases.
