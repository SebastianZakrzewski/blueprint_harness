# Design standards

Status: APPROVED  
Verification: NOT_VERIFIED

## Purpose

Define the stable design expectations for code and repository artifacts created
by agents. Detailed architectural boundaries remain in `../ARCHITECTURE.md` and
`design-docs/architecture-enforcement.md`.

## Legibility

Code should communicate its intent without requiring the reader to reconstruct
hidden state or naming conventions. Prefer explicit control flow, cohesive
units, visible side effects, precise types, and predictable error behavior.

Names must describe functionality or represented type:

- operations use clear verbs;
- booleans use `is`, `has`, `can`, or `should` where natural;
- collections use plural names;
- identifiers include their context when ambiguity exists;
- values with units include the unit;
- vague names are replaced with domain language.

## Function documentation

Every named production function has human-readable contract documentation that
explains, as applicable:

- purpose;
- inputs;
- output;
- errors;
- side effects;
- important invariants.

Generated code, external dependencies, tool-generated migrations, trivial
anonymous callbacks, and tests already described by precise test names are
exempt.

Documentation should add meaning rather than restate syntax.

## Abstractions and patterns

Use a design pattern or abstraction when it solves an evidenced problem in
coupling, boundaries, testing, repeated behavior, composition, or invariant
centralization. Avoid speculative extension points, one-use interfaces without
a boundary reason, indirection that hides control flow, and generic helpers that
erase domain meaning.

## Side effects

Persistence, network calls, model calls, messaging, file access, time,
randomness, and external service mutations are explicit and injected or
isolated at appropriate boundaries. Pure domain behavior remains separable from
effects where doing so improves correctness and testing.

## Errors

Errors expose stable semantics rather than incidental library messages. Expected
domain outcomes are distinguished from infrastructure failures. Context is
preserved without leaking secrets or personal data. Retryability and user
visibility are explicit where relevant.

## Tests as examples

Tests describe observable behavior, important invariants, and regression cases.
They avoid asserting implementation trivia unless that detail is itself a
contract. A bug fix begins with a reproducing test whenever feasible.

## Diagrams

Use Mermaid inside existing Markdown documents when a relationship, sequence,
topology, state machine, or boundary is materially clearer visually. Do not
create a separate diagram directory or diagram every function and class.

Changing system boundaries, dependencies, component communication, deployment
topology, or a critical data flow requires the corresponding diagram update in
the same PR. CI validates Mermaid syntax; structural tests validate actual code.

Mermaid is a CURSOR-ADAPTER implementation choice, not a publicly confirmed
OpenAI repository format.

## Review bar

Correct, maintainable, testable, and legible output that satisfies approved
invariants passes. Personal stylistic preferences that are not encoded as an
approved rule do not block a change.
