# Logic Prototype Execution Packet

This folder converts [PRD_Logic.md](/Users/ethanyang/Documents/GitHub/logic/PRD_Logic.md) into agent-ready implementation docs for Codex, Claude Code, and similar coding agents.

This packet now defines a reduced demo target optimized for minimum engineering time:
- one polished playable loop: `first-run personalization -> home -> question -> completion`
- one playable module with three preview-only module cards
- reset and preset jumps as first-class demo affordances
- breadth surfaces removed unless they directly strengthen the core loop

For this prototype, "backend" means the app's in-repo data, state, selectors, content pack, and preset layer. It does not mean adding a real backend service.

## Purpose

The PRD is the product source of truth. These execution docs are the build source of truth for the reduced demo packet.

Use this packet to:
- eliminate ambiguity before coding
- constrain agent behavior
- remove expensive non-demo-critical work
- standardize acceptance criteria for engineering and design review
- deliver one convincing flow instead of a broad but partially wired app

## Packet Structure

- `contracts/01-product-contract.md`
  Product behavior, feature rules, state mutations, and reset/preset requirements.
- `contracts/02-design-contract.md`
  Design tokens, component, motion, and implemented-screen composition rules.
- `contracts/03-technical-architecture.md`
  Architecture, file ownership, data contracts, routing, and library boundaries.
- `contracts/04-implementation-waves.md`
  Ordered build sequence and dependency guidance for the reduced scope.
- `contracts/05-ambiguities-and-decisions.md`
  Resolved contradictions and explicit simplification decisions.
- `contracts/06-delivery-ownership.md`
  Explicit frontend/backend ownership split, handoff rules, and merge boundaries.
- `tasks/`
  Agent-ready implementation tasks with narrow ownership and acceptance criteria.
- `checklists/01-qa-and-demo-checklist.md`
  QA, regression, and live-demo validation steps for the core loop.
- `checklists/02-task-status-checklist.md`
  Shared task completion checklist used by both agents.

## Operating Rules For Coding Agents

1. Read `contracts/05-ambiguities-and-decisions.md` and `contracts/06-delivery-ownership.md` before making changes.
2. Treat `MUST` and `MUST NOT` statements as binding.
3. Do not invent behavior, copy, layouts, or states that are not specified in the packet.
4. If a needed behavior is unspecified, add a decision request instead of improvising.
5. Do not introduce new libraries unless a task explicitly allows it.
6. Do not widen task scope. Complete one task cleanly before taking another.
7. Preserve file ownership boundaries in task docs to reduce merge conflicts.
8. Do not revive de-scoped surfaces unless the packet is revised again.

## Delivery Split

- Codex owns backend work: `src/store/*`, `src/lib/*`, `src/data/*`, preset loaders, and other non-visual business logic.
- Claude Code owns frontend work: `src/screens/*`, `src/components/*`, `src/styles/*`, and all user-visible behavior in the active core loop.
- Shared integration happens through typed contracts, selectors, content exports, and documented props/state boundaries.
- The running backend-to-frontend handoff artifact lives at `execution/handoffs/codex-to-claude.md`.
- This split MUST NOT change product scope, feature behavior, or demo outcomes.

## Recommended Delivery Order

1. Resolve any remaining open decisions in `contracts/05-ambiguities-and-decisions.md`
2. Execute active tasks in wave order from `contracts/04-implementation-waves.md`
3. Land backend contracts before dependent frontend integration
4. Run the QA checklist after each wave
5. Rehearse the demo with reset and presets before any optional polish

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
- the core loop is cleaner after the change, not broader
- the relevant checklist items can be verified without interpretation
