# Delivery Ownership

This document defines the execution split between Codex and Claude Code for the reduced core-loop contract captured in `/execution`.

## 1. Core Rule

- Codex owns backend work.
- Claude Code owns frontend work.
- The same product MUST result from this split as from the original unified plan.

## 2. Backend Definition

For this prototype, backend work means the non-visual application layer inside the same repo:
- persisted store design and mutations
- pure business logic
- lightweight progression helpers used by the active demo path
- typed content exports and preset-state definitions
- preset-state definitions and loaders
- selectors and typed contracts used by the UI
- validation and integrity checks for authored data when worth the effort

Backend work does NOT mean:
- adding a real server
- adding an API layer
- adding network dependencies
- altering the out-of-scope boundaries from the PRD

## 3. Frontend Definition

Frontend work means the visible and interaction-facing layer:
- app shell and phone frame
- screen composition for the active demo path
- UI primitives
- question presentation
- first-run personalization, home, and completion surfaces
- toasts, sheets, modals, and completion surfaces
- styling, layout, spacing, and token application

Frontend work MUST consume backend contracts rather than recreating them locally.

## 4. File Ownership

### Codex

- `src/store/*`
- `src/lib/*`
- `src/data/*`
- backend-facing shared types where applicable

### Claude Code

- `src/screens/*`
- `src/components/*`
- `src/styles/*`
- most `src/hooks/*`

### Shared But Contract-Driven

- `App.tsx`
- route wiring
- integration glue that binds backend actions/selectors to frontend views

Rule:
- if a shared file must change, backend contracts land first and frontend integration follows
- `App.tsx` is the highest-priority shared integration point in this packet revision

## 5. Handoff Requirements

Codex handoff to Claude Code SHOULD include:
- final type shapes
- selector names and expected outputs
- store actions and side-effect rules
- content exports or preset payloads
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
- De-scoped tasks MUST remain de-scoped unless the packet is revised again.

## 7. Review Rules

- Backend review checks determinism, schema stability, selector correctness, and state consistency.
- Frontend review checks layout, token compliance, interaction fidelity, and demo polish on the active screens.
- Cross-review checks only whether the integration preserves the product contract.

## 8. Non-Negotiable Constraint

This split is an execution constraint inside the simplified demo target. If an ownership decision would weaken the agreed demo contract or re-expand scope unintentionally, the ownership decision is wrong and the docs must be revised.
