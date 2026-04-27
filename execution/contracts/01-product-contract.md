# Product Contract

This document converts the PRD into implementation rules. Product behavior defined here is binding unless superseded by an approved decision in `05-ambiguities-and-decisions.md`.

## 1. Product Intent

- The prototype MUST feel like a shipping mobile app during a guided demo.
- The prototype MUST prefer perceived polish over production-grade backend realism.
- The prototype MUST support end-to-end interactive primary flows with persisted state.
- The prototype MUST be resettable or jumpable to preset states in under 2 seconds.
- The prototype MUST NOT expose incomplete flows, dead controls, or visible "not implemented" moments during demo paths.

## 2. Scope Boundaries

### In Scope

- onboarding
- home/dashboard
- module detail
- question engine
- module completion
- progress/profile
- daily challenge
- XP, streaks, badges
- demo presets and reset tools
- curated static content and visual puzzles
- accessibility hygiene for primary interaction paths

### Out Of Scope

- authentication
- real backend
- push notifications
- social features
- payments
- adaptive difficulty algorithms
- analytics pipeline
- full accessibility audit
- internationalization
- real offline/PWA support

## 3. App-Level Behavior

- The app MUST render inside a phone frame at desktop widths and edge-to-edge on mobile widths.
- The app MUST use a memory router.
- The app MUST persist all user state under one localStorage namespace key: `logic-app-v1`.
- The app MUST route first launch users to onboarding and returning users to home.
- The app MUST support reset without a full page reload.

## 4. State Contract

The app store MUST contain:
- user profile: display name, avatar selection, selected goal, baseline level
- XP total, current streak, longest streak, last-active local date
- module progress keyed by `moduleId`
- question progress keyed by `questionId`
- earned badge IDs
- daily challenge state
- user preferences for sound, reduced motion / skip animations mode, and grid overlay
- onboarding checkpoint state

The store MUST expose:
- `resetApp()`
- actions for answering questions
- actions for awarding XP
- actions for recomputing streaks
- actions for applying demo presets
- actions for updating demo-control preferences
- actions for onboarding progression

## 5. Screen Contracts

### Splash / First Launch Detection

- MUST detect whether a user profile exists.
- MUST route immediately to onboarding or home.
- MUST NOT require user input.

### Onboarding

- MUST contain 3 narrative moments:
  - Welcome and goal selection
  - Sample puzzle
  - Diagnostic and reveal
- MUST checkpoint progress after each completed step.
- MUST resume at the last completed step after reload.
- MUST award XP for sample and diagnostic questions.
- MUST NOT count onboarding question activity toward module progress or module question totals.
- MUST collect display name and avatar before entering home.
- MUST compute baseline level from diagnostic score.
- MUST highlight a recommended starting module on first home reveal.

### Home / Dashboard

- MUST be the default post-onboarding screen.
- MUST show greeting, current date, streak, XP, level, and daily challenge above the fold.
- MUST show continue-learning module and all modules list.
- MUST show recent activity and weekly heatmap below the fold.
- MUST reflect real persisted state on reload.

### Module Detail

- MUST show title, subtitle, icon/shape, difficulty, progress, stats, and CTA.
- MUST show concept primer before the first module question is answered.
- MUST collapse primer after module start into a review affordance.
- MUST respect locked/unlocked state.

### Question Screen

- MUST support all five question types through one shared shell.
- MUST preserve in-progress selection if the app is backgrounded or reloaded before submit.
- MUST disable submit until an option is selected.
- MUST preserve answered state once submitted.
- MUST show explanation after every submit.
- MUST advance to next unanswered question or module completion.

### Module Completion

- MUST trigger immediately after the final module question result flow.
- MUST show stats, reward totals, newly earned badges, and next-module CTA.
- MUST be a full-screen takeover, not a toast.

### Progress / Profile

- MUST show avatar, display name, member-since date, large stat tiles, 30-day heatmap, earned/locked badges, and per-module accuracy breakdown.

### Daily Challenge

- MUST show one deterministic question per local calendar date.
- MUST reflect completion state on both home and daily surfaces.
- MUST show a 7-day result strip.

## 6. Question Lifecycle Contract

Each question interaction MUST follow this order:
1. skeleton state
2. prompt reveal
3. option reveal
4. selection
5. submit
6. artificial delay
7. result reveal
8. explanation reveal
9. continue

Rules:
- Users MUST NOT change answers after submit.
- Correct answers MUST award `+10 XP`.
- Incorrect answers MUST award `+2 XP`.
- Daily challenge correct MUST award `+50 XP`.
- Daily challenge incorrect MUST award `+5 XP`.
- Module completion MUST award `+25 XP`.

## 7. Module System Contract

- There MUST be exactly four modules:
  - Foundations
  - Conditional Reasoning
  - Logical Fallacies
  - Visual Patterns
- Each module MUST contain 30 authored questions.
- Foundations MUST be unlocked by default.
- Other modules MUST unlock in sequence based on prerequisite completion.
- Locked modules MUST remain visible but non-enterable.
- Tapping a locked module MUST show a toast explaining the prerequisite.

## 8. Question Bank Contract

- Questions MUST be static build-time data.
- Visual questions MUST use structured JSON specs, not image files.
- Visual puzzles MUST render as deterministic SVG.
- Every question MUST have exactly one defensible correct answer.
- Every question MUST include a concise explanation.
- Daily challenge eligibility MUST be an explicit boolean on the question record.

## 9. XP, Streak, Badges, Daily Rules

### XP

- Level MUST be derived as `floor(XP / 200) + 1`.
- XP displays MUST update with count-up animation in the UI.

### Streak

- A streak day MUST equal any local calendar day with at least one answered question.
- If more than one local calendar day passes without activity, streak MUST reset unless a freeze is available.
- Streak milestones MUST exist for days `3, 7, 14, 30, 100`.

### Badges

- Badge earning MUST be deterministic from persisted activity.
- Badge reveals MUST be toast-driven except when also shown on module completion.

### Daily Challenge

- Selection MUST be deterministic per local date from the eligible pool.
- Same local date MUST always produce the same question.

## 10. Demo Controls Contract

- Demo Controls MUST be reachable by keyboard shortcut and by gear icon.
- The menu MUST include:
  - reset to first launch
  - preset states
  - sound toggle
  - skip animations toggle
  - grid overlay toggle
  - app version
- Preset loading MUST route the user to the most relevant screen for that state.
- Reset MUST clear persisted state and route to onboarding/welcome immediately.

## 11. Accessibility Contract

- Primary flows MUST be keyboard operable.
- Semantic HTML MUST be used for interactive controls.
- Focus states MUST be visible.
- Contrast MUST satisfy normal in-app readability expectations for the approved palette.
- Reduced motion mode MUST disable nonessential motion and sound.

## 12. Demo Readiness Gates

The prototype is not demo-ready unless:
- no console errors occur in primary flows
- no visible layout shift occurs during core screens
- initial load appears styled on first paint
- sounds are ready before first interactive use
- reset and preset flows work quickly and repeatably
