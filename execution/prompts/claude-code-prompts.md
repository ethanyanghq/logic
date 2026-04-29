# Claude Code Execution Prompts

Use these prompts exactly as written. They are for Claude Code only and cover the frontend-owned tasks.

Before running any prompt, ensure the backend dependencies named in the task are already landed in the repo. Frontend foundation work may begin before later backend waves, but Claude Code must read `execution/handoffs/codex-to-claude.md` before each frontend task that consumes backend-owned contracts.
When a task is fully complete, also check its matching box in `execution/checklists/02-task-status-checklist.md`.

## T001

```text
You are Claude Code executing task T001 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T001-app-shell-and-layout.md

Your scope is frontend only. Do not change product scope or behavior. Do not touch backend-owned files such as src/store/*, src/lib/*, or src/data/*.

Implement T001 exactly:
- create the app shell, phone-frame container, status bar, home indicator, and base layout structure
- support desktop phone-frame mode and mobile edge-to-edge mode
- reserve sticky status bar and home-indicator regions
- support scrolling inside the frame content area
- render a live clock updated every minute

Edit only files within this ownership scope unless a minimal shared integration change is strictly required:
- src/App.tsx
- src/main.tsx
- src/components/layout/*
- src/styles/globals.css

Constraints:
- do not introduce feature-screen-specific business logic
- do not hardcode page content into layout primitives
- match the black-glass hardware feel from the design contract
- no layout shift from status-bar updates

When finished:
- run any relevant local verification available for this repo
- verify the shell in desktop and mobile modes
- check the `T001` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T002

```text
You are Claude Code executing task T002 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T002-design-tokens-and-tailwind.md

Your scope is frontend only. Do not change product scope or behavior. Do not touch backend-owned files such as src/store/*, src/lib/*, or src/data/*.

Implement T002 exactly:
- encode Eclipse Glass into Tailwind/theme/global tokens
- establish the approved spacing and typography rules
- map PRD color tokens into reusable theme variables
- define typography scale and font-loading hooks
- encode the approved gradients and glow tokens

Edit only:
- tailwind.config.ts
- src/styles/globals.css
- minimal shared token helper files if needed

Constraints:
- do not introduce off-system colors, gradients, or spacing
- keep the token names aligned with the execution/design contracts
- do not widen into component or screen work beyond what is needed to prove the tokens work
- "prove the tokens work" means build/typecheck output and inspecting the bundled CSS — do NOT edit src/App.tsx, screens, or primitives to add token-sampler UI (a prior run drifted into App.tsx; that was out of scope)

When finished:
- run any relevant local verification available for this repo
- confirm primitives and shell can consume named tokens
- check the `T002` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T003

```text
You are Claude Code executing task T003 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T003-ui-primitives.md

Dependencies T001 and T002 must already be landed.

Your scope is frontend only. Do not change product scope or behavior. Do not touch backend-owned files such as src/store/*, src/lib/*, or src/data/*.

Implement T003 exactly:
- build the reusable UI primitive set defined in the execution/design contracts
- support hover, press, focus, and disabled states where applicable
- keep the APIs narrow and composable

Primary ownership:
- src/components/ui/*

Prioritize first:
- Button
- Card
- ProgressRing
- ProgressBar
- StatTile
- Skeleton
- Toast
- BottomSheet
- Modal
- IconButton
- Avatar

Constraints:
- screens should be able to compose these primitives without rewriting common interaction patterns
- do not reimplement business logic in the primitives
- stay inside the approved token, spacing, and typography system

When finished:
- render or otherwise validate a primitive gallery if practical
- check the `T003` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T005

```text
You are Claude Code executing task T005 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T005-demo-controls-shell.md

Dependencies T003 and T004 must already be landed.

Your scope is frontend only. Consume backend reset actions, preset metadata, and preference selectors from the backend contract. Do not redefine preset payloads or persistence rules in UI code.

Implement T005 exactly:
- build the Demo Controls bottom sheet
- support opening from Cmd/Ctrl + Shift + R
- support opening from the home-screen gear icon
- include reset, skip animations, grid overlay, and version surfaces

Edit only:
- src/components/demo/*
- src/hooks/useKeyboardShortcut.ts
- minimal frontend integration points if required

Constraints:
- no backend business-logic changes
- menu must open reliably from any screen context
- reset path must confirm and then clear app state through backend-owned actions

When finished:
- test shortcut from screen, modal, and question contexts if available
- check the `T005` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T006

```text
You are Claude Code executing task T006 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T006-question-engine-shell.md

Dependencies T003 and T004 must already be landed.

Your scope is frontend only. Consume backend state/actions/selectors. Do not recreate question progression logic in the screen layer.

Implement T006 exactly:
- build the shared question experience for text multiple-choice questions first
- include skeleton state, prompt reveal, option reveal, selection, submit lifecycle, result reveal, explanation panel, and continue flow
- preserve answered state and prevent editing after submit

Edit only:
- src/screens/question/*
- shared question components under src/components/* if needed

Constraints:
- respect the exact question lifecycle and visual feedback contract
- do not mutate canonical question rules in UI code
- reload mid-question and after submit must behave correctly through backend state

When finished:
- test correct and incorrect paths
- test reload mid-question and after submit if possible
- check the `T006` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T007

```text
You are Claude Code executing task T007 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T007-first-visual-puzzle-renderer.md

This task is de-scoped in the simplified demo build.
Do not implement visual-question renderer work unless the execution packet is revised again.
```

## T008

```text
You are Claude Code executing task T008 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T008-home-dashboard.md

Dependencies T003, T004, and T012 must already be landed.

Your scope is frontend only. Consume store-driven data from backend selectors/actions.

Implement T008 exactly:
- build the home launchpad screen
- include greeting/date, a primary Foundations start/continue CTA, enough progress context to feel personalized, the playable Foundations card, and three preview-only module cards
- ensure the screen reflects real store state and routes directly into question flow

Edit only:
- src/screens/home/*
- minimal frontend composition helpers if needed

Constraints:
- above-the-fold priorities must match the design contract
- do not reimplement XP or module logic in UI code
- support verification with fresh, mid-progress, and power-user states using seeded store data or later presets

When finished:
- verify the screen with seeded data or the available presets
- check the `T008` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T009

```text
You are Claude Code executing task T009 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T009-module-detail.md

This task is de-scoped in the reduced core-loop packet.
Do not implement a separate module-detail screen unless the execution packet is revised again.
```

## T010

```text
You are Claude Code executing task T010 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T010-onboarding-flow.md

Dependencies T004 and T008 must already be landed.

Your scope is frontend only. Consume first-run completion and profile state from backend actions/selectors. Do not recreate persistence rules in UI code.

Implement T010 exactly:
- build a lightweight first-run personalization flow
- collect display name and goal selection
- persist in-progress state across reload
- route directly to home on completion

Edit only:
- src/screens/onboarding/*
- minimal frontend composition helpers if required

Constraints:
- personalization must resume correctly after reload using backend state
- pacing should feel fast and polished, not like a long form
- do not add sample-question, diagnostic, avatar, or recommendation work

When finished:
- verify reload behavior before completion if possible
- check the `T010` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T011

```text
You are Claude Code executing task T011 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T011-remaining-puzzle-renderers.md

This task is de-scoped in the simplified demo build.
Do not implement visual-question renderer work unless the execution packet is revised again.
```

## T014

```text
You are Claude Code executing task T014 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T014-daily-challenge.md

This task is de-scoped in the reduced core-loop packet.
Do not implement a standalone daily screen unless the execution packet is revised again.
```

## T015

```text
You are Claude Code executing task T015 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T015-module-completion.md

Dependencies T006, T008, and T012 must already be landed.

Your scope is frontend only. Consume completion metadata from backend/store contracts without requiring advanced reward derivation.

Implement T015 exactly:
- build the full-screen completion experience
- include completion takeover, clear completion messaging, and a back-home CTA
- use fixed or lightweight status copy if needed rather than advanced reward choreography

Edit only:
- src/screens/completion/*
- src/components/feedback/*
- minimal integration points required to transition from question flow into completion

Constraints:
- preserve the restrained completion visual language
- no dead-end behavior after the final question
- do not derive badge or reward logic in UI code

When finished:
- verify transition from final question into completion screen
- check the `T015` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```

## T017

```text
You are Claude Code executing task T017 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T017-progress-profile-screen.md

This task is de-scoped in the reduced core-loop packet.
Do not implement a progress/profile screen unless the execution packet is revised again.
```

## T018

```text
You are Claude Code executing task T018 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T018-motion-polish.md

This task is de-scoped in the reduced core-loop packet.
If you add small motion touches inside active tasks, do so there rather than reviving a dedicated motion pass.
```

## T019

```text
You are Claude Code executing task T019 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/02-design-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T019-sound-system.md

This task is de-scoped in the reduced core-loop packet.
Do not implement a dedicated sound system unless the execution packet is revised again.
```

## T020

```text
You are Claude Code executing task T020 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/checklists/01-qa-and-demo-checklist.md
- execution/contracts/01-product-contract.md
- execution/contracts/02-design-contract.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T020-qa-and-demo-hardening.md

All active feature tasks should already be complete.

Your scope is frontend only. Route backend defects back to the owning backend task rather than patching business logic in UI code.

Implement T020 exactly:
- eliminate frontend-originated console errors in the active demo path
- audit layout stability
- verify first paint behavior
- rehearse reset and all presets
- polish the active demo screens

Edit only frontend-facing files as needed, plus the QA checklist if findings require updates.

Constraints:
- focus on demo safety, visible polish, and interaction stability in the active path
- do not silently fix backend logic in the UI layer

When finished:
- report remaining issues by owner if any
- check the `T020` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- summarize what changed, what you verified, and any blockers
```
