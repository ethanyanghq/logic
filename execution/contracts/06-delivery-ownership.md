# Delivery Ownership

This document defines the execution split between Codex and Claude Code. It changes ownership only. It does not change product scope, product behavior, or the target demo.

## 1. Core Rule

- Codex owns backend work.
- Claude Code owns frontend work.
- The same product MUST result from this split as from the original unified plan.

## 2. Backend Definition

For this prototype, backend work means the non-visual application layer inside the same repo:
- persisted store design and mutations
- pure business logic
- XP, streak, badge, daily, and onboarding recommendation rules
- static data schemas and normalized content files
- preset-state definitions and loaders
- selectors and typed contracts used by the UI
- validation and integrity checks for authored data

Backend work does NOT mean:
- adding a real server
- adding an API layer
- adding network dependencies
- altering the out-of-scope boundaries from the PRD

## 3. Frontend Definition

Frontend work means the visible and interaction-facing layer:
- app shell and phone frame
- screen composition
- UI primitives
- question presentation
- visual puzzle SVG rendering
- motion behavior
- sound integration
- toasts, sheets, modals, and completion surfaces
- styling, layout, spacing, and token application

Frontend work MUST consume backend contracts rather than recreating them locally.

## 4. File Ownership

### Codex

- `src/store/*`
- `src/lib/*`
- `src/data/*`
- schema-validation helpers
- backend-facing shared types where applicable

### Claude Code

- `src/screens/*`
- `src/components/*`
- `src/styles/*`
- most `src/hooks/*`
- `src/assets/sounds/*`

### Shared But Contract-Driven

- `App.tsx`
- route wiring
- integration glue that binds backend actions/selectors to frontend views

Rule:
- if a shared file must change, backend contracts land first and frontend integration follows

## 5. Handoff Requirements

Codex handoff to Claude Code SHOULD include:
- final type shapes
- selector names and expected outputs
- store actions and side-effect rules
- normalized sample data or preset payloads
- edge cases that the UI must respect
- a task-by-task update in `execution/handoffs/codex-to-claude.md`

Claude Code handoff back to Codex SHOULD include:
- any backend contract gaps discovered during UI integration
- any ambiguity surfaced by real screen composition
- any required read-model that would otherwise force UI-side rule duplication

## 6. Task Rules

- Every task in `execution/tasks` MUST have a single primary owner.
- A frontend task may depend on a backend task, but it MUST NOT absorb that backend scope.
- A backend task may define UI-facing contracts, but it MUST NOT implement final screen/UI behavior.
- QA findings SHOULD be routed back to the owning side rather than fixed opportunistically in the wrong layer.

## 7. Review Rules

- Backend review checks determinism, schema stability, selector correctness, and state consistency.
- Frontend review checks layout, token compliance, interaction fidelity, motion/sound behavior, and demo polish.
- Cross-review checks only whether the integration preserves the product contract.

## 8. Non-Negotiable Constraint

This split is an execution constraint, not a product change. If an ownership decision would weaken the demo, alter user-visible behavior, or cut scope, the ownership decision is wrong and the docs must be revised without changing the product target.
