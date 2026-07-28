# Criteria, dependencies, impact, and progress

Status: PROPOSED
Implementation: NOT_IMPLEMENTED
Verification: NOT_VERIFIED

## Purpose

Turn versioned acceptance definitions and exact-SHA validator evidence into
deterministic criterion and milestone state without allowing manual PASS entry
or weighted progress to hide a required failure.

## Criteria registry

The repository contains one versioned registry per project. Each record
includes:

```ts
interface CriterionDefinition {
  criterionId: string;
  title: string;
  descriptionReference: string;
  owner: string;
  milestoneId: string;
  weight: number;
  applicability: ApplicabilityRule;
  dependencies: string[];
  requiredValidations: string[];
  affectedModules: string[];
  affectedContracts: string[];
  affectedPaths: string[];
  riskClass: string;
}
```

The human-readable Product Spec remains authoritative for intent. The registry
is its mechanically usable index.

## Registry validation

Reject:

- duplicate or unstable IDs;
- missing owners or milestones;
- unknown validators;
- unknown dependencies;
- dependency cycles;
- negative weights;
- invalid applicability expressions;
- references outside the enrolled repository;
- required criteria not assigned to one milestone.

Registry version and checksum are inputs to every derived state and verified
snapshot.

## Derived state

```text
UNKNOWN
PASS
FAIL
BLOCKED
POSSIBLE_REGRESSION
NOT_APPLICABLE
```

Decision order for a required criterion:

1. integrity conflict or unusably stale required source → `UNKNOWN` or
   `BLOCKED`;
2. required validation FAIL/ERROR → `FAIL`;
3. required dependency not PASS → `BLOCKED`;
4. impact invalidates prior evidence → `POSSIBLE_REGRESSION`;
5. all current exact-SHA evidence passes → `PASS`;
6. applicability proves exclusion → `NOT_APPLICABLE`.

The final decision table is versioned and tested. Arrival order never changes
the outcome for the same canonical inputs.

## Impact model

A changed path or contract is mapped to affected criteria through:

```text
changed paths
→ modules/contracts/API/events/policies
→ registry impact declarations
→ dependent criteria
→ required revalidation
```

High-risk or unknown impact fails closed. A dependent criterion retains
historical PASS for its historical SHA but current state becomes
`POSSIBLE_REGRESSION` or `BLOCKED` until exact-SHA validation completes.

## Milestone state

A milestone is complete only when:

- every applicable required criterion is PASS;
- dependencies are complete;
- required global gates pass;
- no active blocking scope conflict applies;
- the evidence package is complete where required.

Weighted progress:

```text
sum(weight of applicable PASS criteria)
/
sum(weight of applicable criteria)
```

It is a display metric. `99%` never overrides one required non-PASS criterion.

## Recalculation

Criterion and milestone state is a projection. On a late event, registry
change, policy change, or corrected source fact:

1. identify affected project/SHA/registry version;
2. recompute impacted criteria in deterministic dependency order;
3. append change-reason events;
4. update read models and watermark;
5. preserve prior historical projection evidence.

## Validation fixtures

- valid acyclic registry;
- duplicate ID;
- missing dependency;
- cycle;
- unknown validator;
- invalid applicability;
- exact-SHA evidence PASS;
- wrong-SHA evidence ignored;
- one failure among multiple validations;
- dependency blocked;
- impacted contract causes regression state;
- not-applicable criterion;
- weighted progress with required non-PASS;
- late result convergence;
- registry version change.

## References

- Product Spec: `../product-specs/harness-platform-v1.1.md`
- Scope conflicts: `execplan-scope-coordination.md`
- Snapshot eligibility: `snapshot-verification.md`
