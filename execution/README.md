# Logic Prototype Execution Packet

This folder converts [PRD_Logic.md](/Users/ethanyang/Documents/GitHub/logic/PRD_Logic.md) into agent-ready implementation docs for Codex, Claude Code, and similar coding agents.

The product target is unchanged. This packet now adds an explicit delivery split:
- Codex owns backend work
- Claude Code owns frontend work

For this prototype, "backend" means the app's data, state, business-logic, preset, and schema layer inside the same repo. It does not mean adding a real backend service.

## Purpose

The PRD is the product source of truth. These execution docs are the build source of truth.

Use this packet to:
- eliminate ambiguity before coding
- constrain agent behavior
- break the work into merge-safe tasks
- standardize acceptance criteria for engineering and design review

## Packet Structure

- `contracts/01-product-contract.md`
  Product behavior, feature rules, state mutations, and demo/reset requirements.
- `contracts/02-design-contract.md`
  Design tokens, motion, sound, component, and screen-composition rules.
- `contracts/03-technical-architecture.md`
  Architecture, file ownership, data contracts, routing, and library boundaries.
- `contracts/04-implementation-waves.md`
  Ordered build sequence, dependency graph, and parallelization guidance.
- `contracts/05-ambiguities-and-decisions.md`
  Resolved contradictions, assumed defaults, and items that still require product approval.
- `contracts/06-delivery-ownership.md`
  Explicit frontend/backend ownership split, handoff rules, and merge boundaries.
- `tasks/`
  Agent-ready implementation tasks with narrow ownership and acceptance criteria.
- `checklists/01-qa-and-demo-checklist.md`
  QA, regression, and live-demo validation steps.
- `checklists/02-task-status-checklist.md`
  Shared task completion checklist used by both agents.

## Operating Rules For Coding Agents

1. Read `contracts/05-ambiguities-and-decisions.md` and `contracts/06-delivery-ownership.md` before making changes.
2. Treat `MUST` and `MUST NOT` statements as binding.
3. Do not invent behavior, copy, layouts, or states that are not specified in the packet.
4. If a needed behavior is unspecified, stop and add a decision request instead of improvising.
5. Do not introduce new libraries unless a task explicitly allows it.
6. Do not widen task scope. Complete one task cleanly before taking another.
7. Preserve file ownership boundaries in task docs to reduce merge conflicts.
8. Do not cross the frontend/backend boundary unless the task explicitly says to hand off or consume an existing contract.

## Delivery Split

- Codex owns backend work: `src/store/*`, `src/lib/*`, `src/data/*`, schema validation, preset loaders, and other non-visual business logic.
- Claude Code owns frontend work: `src/screens/*`, `src/components/*`, `src/styles/*`, motion, sound wiring, SVG rendering, and all user-visible UI behavior.
- Shared integration happens through typed contracts, selectors, data schemas, and documented props/state boundaries.
- The running backend-to-frontend handoff artifact lives at `execution/handoffs/codex-to-claude.md`.
- This split MUST NOT change product scope, feature behavior, or demo outcomes.

## Recommended Delivery Order

1. Resolve any remaining open decisions in `contracts/05-ambiguities-and-decisions.md`
2. Execute tasks in wave order from `contracts/04-implementation-waves.md`, with backend tasks landing before dependent frontend tasks
3. Run the QA checklist after each wave
4. Rehearse the demo with preset states before final polish

## Definition Of Ready

A task is ready for an agent only if:
- dependencies are satisfied
- file ownership is explicit
- acceptance criteria are objective
- visual/design constraints are linked
- verification steps are stated

## Definition Of Done

A task is done only when:
- implementation matches the relevant contracts
- no contradictory behavior remains inside the touched scope
- strict typing/build passes in the eventual app repo
- the relevant checklist items can be verified without interpretation
