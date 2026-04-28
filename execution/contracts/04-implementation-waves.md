# Implementation Waves

This document defines the recommended execution order, dependency graph, and parallelization strategy.

All waves preserve the simplified demo target:
- Codex executes backend tasks
- Claude Code executes frontend tasks

## Wave 0: Clarify And Normalize

Goal:
- remove contradictions
- define assumed defaults
- lock contracts before coding

Outputs:
- `05-ambiguities-and-decisions.md`
- approved task list

Parallelism:
- single-owner only

Gate to next wave:
- all blocking ambiguities resolved or explicitly marked as accepted assumptions

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

Backend work:
- none

Frontend work:
- Task T001 app shell/layout
- Task T002 Tailwind/token setup
- Task T003 UI primitives

Merge risks:
- shared styling primitives

Gate to next wave:
- app renders inside phone frame
- core primitives exist
- no token-system contradictions

## Wave 2: State And Demo Control Foundations

Scope:
- Zustand persisted store
- reset action
- preferences
- demo menu shell
- keyboard shortcut plumbing

Dependencies:
- Wave 1

Backend work:
- Task T004 store/domain foundation

Frontend work:
- Task T005 demo controls shell

Gate to next wave:
- state persists across reload
- reset works without reload
- demo menu opens from keyboard and gear entry point

## Wave 3: Core Learning Loop

Scope:
- question engine shell
- text MCQ flow
- skeleton/loading behavior
- answer submission lifecycle
- explanation reveal

Dependencies:
- Waves 1-2

Backend work:
- none beyond T004 contracts consumed by UI

Frontend work:
- Task T006 question engine shell

Gate to next wave:
- one full question loop works end-to-end
- persisted question state behaves correctly

## Wave 4: Canonical Content And Primary Screens

Scope:
- content schema and question-bank integration
- home/dashboard
- module detail
- onboarding flow

Dependencies:
- Waves 1-3

Backend work:
- Task T012 content schema and question-bank integration

Frontend work:
- Task T008 home/dashboard
- Task T009 module detail
- Task T010 onboarding

Notes:
- onboarding depends on question shell
- home/module/onboarding screens depend on canonical module/question data from T012 in addition to store shape and primitive stability

Gate to next wave:
- first-time user can complete onboarding and land on personalized home
- Foundations entry and return flow works

## Wave 5: Simplified Demo Scope Hold

Scope:
- no additional renderer breadth
- keep delivery focused on the single playable module and preset-backed demo states

Dependencies:
- Waves 3-4

Backend work:
- none

Frontend work:
- none

Gate to next wave:
- no visual-question work remains in active scope

## Wave 6: Progression Systems

Scope:
- XP and level displays
- streak logic
- badges
- daily challenge
- module completion

Dependencies:
- Waves 2-5

Backend work:
- Task T013 XP/streak/badge rules

Frontend work:
- Task T014 daily challenge
- Task T015 module completion

Merge risks:
- shared store-derived selectors

Gate to next wave:
- progression states are deterministic
- completion and badge flows are demo-safe

## Wave 7: Demo Presets And Power States

Scope:
- preset-state data
- fast jumps into high-value demo scenarios
- progress/profile screen

Dependencies:
- Waves 2-6

Backend work:
- Task T016 demo presets

Frontend work:
- Task T017 progress/profile

Gate to next wave:
- all presets load quickly and route correctly
- profile reflects preset data correctly
- completion-ready and power-user states can be demonstrated without replaying full progression

## Wave 8: Motion, Sound, And Polish

Scope:
- ambient motion
- count-up behavior
- sound preload and priority
- glow tuning
- final interaction polish

Dependencies:
- all earlier waves

Backend work:
- none

Frontend work:
- Task T018 motion polish
- Task T019 sound system

Gate to final QA:
- motion and sound follow contracts
- skip-animations mode suppresses both correctly

## Wave 9: Demo Hardening

Scope:
- console cleanliness
- layout-shift audit
- first-paint audit
- preset rehearsals
- polish on likely demo surfaces

Dependencies:
- all earlier waves

Backend work:
- address backend defects through the owning backend tasks

Frontend work:
- Task T020 QA/demo hardening

Gate to release:
- all checklist items pass
- live demo can be run without workaround narration

## Recommended Agent Parallelization Rules

- Parallelize only tasks with disjoint write ownership.
- Do not split shared store contracts across multiple agents at the same time.
- Do not run motion polish before the underlying flows are stable.
- Pull forward the most demo-visible states early: daily card, completion screen, power-user preset.
- Backend tasks should land selectors, schemas, and preset contracts before the dependent frontend wave begins.
- Frontend tasks should consume backend contracts rather than inventing stopgap local logic.

## Recommended Review Cadence

- Review at the end of every wave.
- Use screenshots and short recordings for design validation.
- Use preset states to verify high-value screens without replaying the full app.
