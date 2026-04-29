# Implementation Waves

This document defines the recommended execution order and dependency graph for the reduced core-loop packet.

All waves preserve the simplified demo target:
- Codex executes backend tasks
- Claude Code executes frontend tasks

## Wave 0: Clarify And Normalize

Goal:
- remove contradictions
- lock the reduced scope before more implementation continues

Outputs:
- `05-ambiguities-and-decisions.md`
- approved reduced task list

Gate to next wave:
- all major scope cuts are documented explicitly

## Wave 1: Foundation Shell

Scope:
- Vite/React app shell
- phone frame
- global styles
- design tokens
- UI primitives
- base layout

Dependencies:
- Wave 0

Frontend work:
- Task T001 app shell/layout
- Task T002 Tailwind/token setup
- Task T003 UI primitives

Gate to next wave:
- app renders inside phone frame
- core primitives exist
- no token-system contradictions remain

## Wave 2: State And Core Loop Foundations

Scope:
- persisted store
- reset action
- demo menu shell
- keyboard shortcut plumbing
- question shell

Dependencies:
- Wave 1

Backend work:
- Task T004 store/domain foundation

Frontend work:
- Task T005 demo controls shell
- Task T006 question engine shell

Gate to next wave:
- state persists across reload
- reset works without reload
- one question loop works end to end

## Wave 3: Canonical Content And Home Launchpad

Scope:
- typed content pack
- playable-module question bank
- home launchpad wired to real content

Dependencies:
- Waves 1-2

Backend work:
- Task T012 typed content pack integration

Frontend work:
- Task T008 home launchpad

Gate to next wave:
- home shows real module content
- Foundations launches directly into question flow

## Wave 4: Entry, Completion, And Demo States

Scope:
- first-run personalization
- completion takeover
- preset snapshots

Dependencies:
- Waves 1-3

Backend work:
- Task T016 demo presets

Frontend work:
- Task T010 first-run personalization
- Task T015 module completion

Gate to next wave:
- first launch routes into personalization then home
- last question routes into completion
- presets jump cleanly into intended states

## Wave 5: Demo Hardening

Scope:
- console cleanliness
- layout-shift audit
- reset and preset rehearsals
- core-loop polish

Dependencies:
- Waves 1-4

Frontend work:
- Task T020 QA/demo hardening

Backend work:
- address backend defects through the owning backend tasks

Gate to release:
- all checklist items pass
- live demo can be run without workaround narration

## De-Scoped Tasks

These tasks remain in the packet for numbering continuity but are not part of the active delivery path:
- T007 visual question renderer
- T009 module detail
- T011 remaining puzzle renderers
- T013 XP, streak, and badges expansion
- T014 standalone daily challenge
- T017 progress/profile
- T018 dedicated motion polish
- T019 sound system

## Recommended Agent Parallelization Rules

- Parallelize only tasks with disjoint write ownership.
- Do not split shared store contracts across multiple agents at the same time.
- Backend tasks should land content and preset contracts before dependent frontend integration begins.
- Frontend tasks should consume backend contracts rather than inventing stopgap local logic.
- Do not revive de-scoped surfaces as side work.

## Recommended Review Cadence

- Review at the end of every wave.
- Use screenshots and short recordings for design validation.
- Use reset and presets to verify high-value screens without replaying the full app every time.
