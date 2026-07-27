# Quality score

Status: APPROVED  
Verification: NOT_VERIFIED  
Last evidence review: not yet performed

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

The Blueprint has approved Docs but no implementation evidence. Therefore its
implementation-related areas remain UNVERIFIED.

| Area | Grade | Current evidence | Blocking gap |
| --- | --- | --- | --- |
| Repository knowledge | UNVERIFIED | Approved canonical Docs | Docs linter and mapping gate not implemented |
| CLI and Universal Core | UNVERIFIED | Approved architecture | No executable implementation or tests |
| Profile SDK | UNVERIFIED | Approved contract | No compatibility fixtures |
| TypeScript Node profile | UNVERIFIED | Approved product scope | No reference scaffold |
| Architecture enforcement | UNVERIFIED | Approved invariant catalogue | No lints or structural tests |
| Worktree isolation | UNVERIFIED | Approved design | Two-worktree gate not executed |
| Local observability | UNVERIFIED | Approved design | Vector/Victoria stack not executed |
| Review and CI | UNVERIFIED | Approved lifecycle | No end-to-end reference PR gate |
| Release and rollback | UNVERIFIED | Approved design | No staging or rollback exercise |
| Security and permissions | UNVERIFIED | Approved policy | No permission-boundary tests |
| Maintenance automation | UNVERIFIED | Approved automation set | No entropy gate |

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
Current level: A0 / design state
PLAN: HUMAN_APPROVAL
MERGE: HUMAN_APPROVAL
STAGING: DISABLED
PRODUCTION: DISABLED
ROLLBACK: DISABLED
INCIDENT_RESPONSE: DISABLED
AUTONOMY_PROMOTION: BLOCKED
```

### Missing evidence

- Stage reference gates are not implemented or executed.
- No qualifying PR history exists.
- No production release history exists.
- No rollback or incident exercise exists.
- No independent quality audit exists.

The Blueprint must start implementation at manual approval regardless of its
designed future capabilities.

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
