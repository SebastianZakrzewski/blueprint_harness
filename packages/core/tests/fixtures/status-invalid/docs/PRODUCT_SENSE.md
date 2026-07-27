# Product sense

Status: APPROVED  
Verification: NOT_VERIFIED

## Product principle

The Harness exists to maximize verified engineering throughput while preserving
human control over intent and judgment. It is successful when the user can
describe outcomes at a higher level, understand the system's decisions, inspect
details when desired, and deliver production systems rapidly without hidden
loss of control.

## Decision hierarchy

When tradeoffs arise, prefer:

1. user and data safety;
2. correctness and reproducibility;
3. legibility to future agents and humans;
4. observability and recoverability;
5. maintainability;
6. verified delivery speed;
7. implementation convenience.

Speed without evidence is not throughput. A complex safeguard without an
evidenced risk is not automatically quality.

## Human role

The human owns:

- business problem and priority;
- product behavior and acceptance;
- risk tolerance;
- normative architecture decisions;
- irreversible, legal, security, and data decisions;
- autonomy promotion.

The user can inspect all code and evidence but need not review every line for
the process to operate at a proven autonomy level.

## Agent role

Agents translate approved intent into plans, implementation, tests, runtime
evidence, documentation, review response, release operations, and maintenance.
When the environment lacks capability, the desired response is to improve the
Harness rather than ask the agent to try the same unsupported action harder.

## Scope discipline

Build the minimum complete system required by approved Docs. Do not add unused
layers, speculative multi-project abstractions, unrequested integrations, or
future-facing capabilities without a concrete current requirement.

## Source discipline

The repository is the durable source of truth. Chat, external documents, and
human memory can initiate a decision, but approved durable knowledge must be
encoded in the relevant Product Spec, Design Doc, plan, test, schema, or rule.

## Autonomy principle

Autonomy belongs to the environment, not to agent confidence. Promotion follows
measurable successful operation, representative traffic, monitoring, recovery
drills, quality evidence, independent evaluation, and human approval. Failure
can automatically remove permission.

## OpenAI fidelity

Preserve the publicly documented OpenAI Harness Engineering structure and
principles. Clearly label technical reconstruction, Cursor adaptation, and
SellGenius extensions. Do not claim access to unpublished OpenAI internals.
