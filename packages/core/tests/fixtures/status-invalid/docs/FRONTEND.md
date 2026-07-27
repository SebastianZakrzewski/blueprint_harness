# Frontend

Status: NOT_APPLICABLE  
Verification: NOT_VERIFIED

## Current scope

The central Harness Blueprint V1 is a CLI, package set, repository template,
and automation system. It has no product frontend and therefore creates no UI
layer or empty frontend application.

## Generated projects

When approved project Docs require a frontend, the resolved Stack Profile adds
the appropriate frontend capability and updates this document with the
project-specific contract. That capability must provide:

- user-facing acceptance criteria;
- real browser or platform runtime control;
- DOM snapshots and screenshots where applicable;
- console and network inspection;
- accessibility and responsive behavior checks appropriate to the product;
- before-and-after evidence for behavioral changes;
- frontend-specific structural and quality invariants.

Cursor Browser is used only when a web frontend exists. API, worker, agentic,
and mobile systems use their appropriate runtime controllers instead.
