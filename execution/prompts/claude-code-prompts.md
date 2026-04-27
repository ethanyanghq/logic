# Claude Code Execution Prompts

Use these prompts exactly as written. They are for Claude Code only and cover the frontend-owned tasks.

Before running any prompt, ensure the backend dependencies named in the task are already landed in the repo. All Codex backend prompts are expected to run before Claude Code, and Claude Code must read `execution/handoffs/codex-to-claude.md` before each frontend task.

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

When finished:
- run any relevant local verification available for this repo
- confirm primitives and shell can consume named tokens
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
- include reset, sound, skip animations, grid overlay, and version surfaces

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

Dependency T006 must already be landed.

Your scope is frontend only.

Implement T007 exactly:
- build the first SVG puzzle renderer
- integrate matrix puzzle rendering into the shared question shell
- render from structured JSON spec
- keep output deterministic
- apply neural palette and solar active semantics

Edit only:
- src/components/puzzles/*
- related typed spec helpers used by the renderer

Constraints:
- no raster assets
- same spec must always produce the same SVG output
- do not move content-schema ownership into the renderer layer

When finished:
- validate a matrix question end-to-end through the question shell
- summarize what changed, what you verified, and any blockers
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

Dependencies T003 and T004 must already be landed.

Your scope is frontend only. Consume store-driven data from backend selectors/actions.

Implement T008 exactly:
- build the home/dashboard screen
- include greeting/date, streak, XP and level, daily challenge card, continue-learning hero, all modules, recent activity, and weekly heatmap
- ensure the hero surfaces reflect real store state

Edit only:
- src/screens/home/*
- minimal frontend composition helpers if needed

Constraints:
- above-the-fold priorities must match the design contract
- do not reimplement XP, streak, or module logic in UI code
- support verification with fresh, mid-progress, and power-user states

When finished:
- verify the screen with the available states/presets
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

Dependencies T003 and T004 must already be landed.

Your scope is frontend only. Consume lock/unlock and progress state from backend-owned contracts.

Implement T009 exactly:
- build the module detail screen
- include hero header, progress/stat surfaces, concept primer, and start/continue CTA
- implement locked-module toast behavior without breaking flow

Edit only:
- src/screens/module/*

Constraints:
- do not redefine unlock logic in the screen layer
- unlocked modules must route into questions
- locked modules must explain the prerequisite cleanly

When finished:
- verify locked and unlocked module behavior
- summarize what changed, what you verified, and any blockers
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

Dependencies T006, T008, and T009 must already be landed.

Your scope is frontend only. Consume checkpointing, XP, and recommendation logic from backend state/actions. Do not recreate these rules in UI code.

Implement T010 exactly:
- build welcome and goal selection
- build the sample puzzle step
- build the 5-question diagnostic
- build profile setup
- build the recommendation highlight on first-home reveal

Edit only:
- src/screens/onboarding/*
- minimal frontend composition helpers if required

Constraints:
- onboarding must resume correctly after reload using backend checkpoint state
- onboarding awards XP but not module progress
- pacing should feel fast and polished, not like a long form

When finished:
- verify reload behavior at each checkpoint boundary if possible
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

Dependency T007 must already be landed.

Your scope is frontend only.

Implement T011 exactly:
- add the remaining visual question renderers
- support sequence completion, odd one out, and rotation/transform puzzles
- add any shared visual spec helpers needed by these renderers

Edit only:
- src/components/puzzles/*

Constraints:
- keep all outputs deterministic SVG
- preserve the neural/solar palette rules
- do not absorb data-schema ownership into renderer code

When finished:
- verify all visual question types render through typed components
- summarize what changed, what you verified, and any blockers
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

Dependencies T004, T006, and T012 must already be landed.

Your scope is frontend only. Consume deterministic daily-selection outputs from backend helpers/store selectors. Do not redefine daily-pool selection or persistence rules in the screen layer.

Implement T014 exactly:
- build the daily tab screen
- render completion state on both home and daily surfaces
- render the 7-day result strip
- integrate the daily challenge into the existing question experience

Edit only:
- src/screens/daily/*
- minimal frontend integration points needed to surface backend daily state

Constraints:
- same local date must produce the same challenge across reloads through backend state
- daily completion must not mutate module progress

When finished:
- verify daily behavior across reloads if possible
- summarize what changed, what you verified, and any blockers
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

Dependencies T009 and T013 must already be landed.

Your scope is frontend only. Consume reward summaries, badge state, and next-module information from backend contracts.

Implement T015 exactly:
- build the full-screen module completion experience
- include completion takeover, stat reveal sequence, badge reveal area, and next-module/back-home CTAs

Edit only:
- src/screens/module/*
- src/components/feedback/*

Constraints:
- preserve the restrained completion/corona visual language
- no dead-end behavior after the final question
- do not derive badge or reward logic in UI code

When finished:
- verify transition from final question into completion screen
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

Dependencies T008, T012, and T013 must already be landed.

Your scope is frontend only. Consume persisted and preset-driven progress state from backend selectors/contracts.

Implement T017 exactly:
- build the progress/profile screen
- include avatar/name/member-since, stat tiles, 30-day heatmap, badges grid, and per-module accuracy bars

Edit only:
- src/screens/progress/*

Constraints:
- data visualizations should follow the neural-vs-solar semantic rules
- do not rederive accuracy, badge, or member-since logic in UI code

When finished:
- verify the screen against available persisted and preset states
- summarize what changed, what you verified, and any blockers
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

All major frontend surfaces through T017 should already be materially complete.

Your scope is frontend only.

Implement T018 exactly:
- centralize spring presets
- apply count-up and progress transitions
- implement ambient motion rules without competition
- respect reduced motion and skip-animations mode

Edit only:
- src/lib/motion.ts
- relevant frontend components and screens

Constraints:
- do not alter product flow or business logic
- motion should reinforce, not compete with, primary actions

When finished:
- verify motion behavior and degraded behavior when disabled
- summarize what changed, what you verified, and any blockers
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

Dependencies T004 and T005 must already be landed, and the major interaction surfaces should already exist.

Your scope is frontend only.

Implement T019 exactly:
- preload sounds
- implement priority drop logic
- wire sound events for the required interactions
- respect the effective sound-enabled rules from the contracts

Edit only:
- src/lib/sound.ts
- src/hooks/useSound.ts
- src/assets/sounds/*
- related frontend integration points

Constraints:
- do not queue lower-priority sounds behind higher-priority ones
- reduced motion and skip-animations mode must suppress sound
- no product-scope expansion beyond the approved sound system

When finished:
- verify first-use sound lag is absent if possible
- summarize what changed, what you verified, and any blockers
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

All major feature tasks should already be complete.

Your scope is frontend only. Route backend defects back to the owning backend task rather than patching business logic in UI code.

Implement T020 exactly:
- eliminate frontend-originated console errors in primary flows
- audit layout stability
- verify first paint and preload behavior
- rehearse reset and all presets
- polish the most likely demo screens

Edit only frontend-facing files as needed, plus the QA checklist if findings require updates.

Constraints:
- focus on demo safety, visible polish, and interaction stability
- do not silently fix backend logic in the UI layer

When finished:
- report remaining issues by owner if any
- summarize what changed, what you verified, and any blockers
```
