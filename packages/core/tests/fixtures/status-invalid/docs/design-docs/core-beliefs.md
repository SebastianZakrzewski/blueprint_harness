# Core beliefs

Status: APPROVED  
Verification: NOT_VERIFIED  
Last reviewed: 2026-07-21

## Humans steer; agents execute

Humans own desired outcomes, priority, acceptance, risk tolerance, and judgment.
Agents own implementation, testing, review response, documentation, and safe
operation inside explicit constraints. Humans may inspect every line but do not
need to author production code.

## Repository knowledge is the system of record

If a durable decision cannot be discovered from repository-local, versioned
artifacts, it does not reliably exist for an agent. Important decisions from
conversations or external tools must be promoted into the appropriate Product
Spec, Design Doc, plan, test, schema, or executable rule.

## Give agents a map, not a giant manual

`AGENTS.md` is a concise entry point. It routes agents through progressive
disclosure to the smallest relevant source set. Context is a limited resource;
irrelevant instructions reduce reliability.

## Make the real system legible

Agents must be able to start, drive, observe, and stop the application or
equivalent runtime. Source inspection alone is insufficient evidence for
behavioral work. UI, API, worker, agentic workflow, mobile runtime, logs,
metrics, and traces receive controllers appropriate to their form.

## Enforce invariants, not personal implementation taste

Central rules protect boundaries, correctness, reproducibility, security, and
legibility. Inside those boundaries agents retain local freedom. A stylistic
preference becomes mandatory only when it is documented and, where feasible,
encoded as a lint, structural test, or review criterion.

## Prefer readable, predictable code

Production code should read like a clear technical narrative. Names expose
intent; units are cohesive; side effects are explicit; comments explain why;
tests demonstrate use. Abstractions are introduced only to solve concrete
coupling, boundary, testing, or repeated-behavior problems.

## Validate every external boundary

Untrusted or external data is never treated as an internal domain value before
parsing and validation. This includes LLM and tool output. Guessed shapes and
probing data without an explicit contract are prohibited.

## Plans are living execution artifacts

Complex work is captured in self-contained ExecPlans that a new agent can
continue using only the repository and the plan. Progress, discoveries,
decisions, outcomes, evidence, recovery, and interfaces evolve with the work.

## Keep changes short-lived and complete

Each PR delivers one coherent, verifiable outcome and leaves the repository in
a working state. A single ExecPlan may span multiple milestone PRs, but each PR
has tests, documentation, evidence, and a rollback path appropriate to risk.

## Loop until clean

Implementation is followed by self-review, independent review, specialist
review when triggered, runtime validation, CI, and response to every actionable
finding. A change is clean only when all required evidence and gates pass.

## Recovery is a first-class capability

Idempotence, resume, rollback, and safe retry are designed before failure.
Production uncertainty stops rollout. Protective downgrade can happen
automatically; privilege escalation cannot.

## Autonomy is earned by the environment

An agent struggling is evidence of missing context, tools, guardrails, or
feedback. Improve the Harness, then demonstrate capability through objective
gates. Agents may recommend promotion; humans approve it. Autonomy is scoped by
capability and risk class, not granted as one unrestricted switch.

## Every incident should strengthen the system

Repair the immediate behavior, then determine whether the cause should become a
test, lint, structural invariant, observability signal, release gate, or
documentation update. Repeated human feedback should compound into reusable
protection.

## Entropy requires continuous garbage collection

Agents replicate existing patterns, including weak ones. Recurring gardeners
scan for drift, update evidence-based quality grades, and open small targeted
PRs. Technical debt is paid down continuously rather than accumulated for a
large cleanup.

## Provenance

These beliefs operationalize the public OpenAI Harness Engineering model. Exact
implementation mechanisms specific to Cursor, thresholds, Sentry, and reusable
profile composition are explicitly identified in their detailed Design Docs.
