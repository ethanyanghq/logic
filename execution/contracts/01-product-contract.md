# Product Contract

This document converts the PRD into implementation rules for the reduced demo packet. Product behavior defined here is binding unless superseded by an approved decision in `05-ambiguities-and-decisions.md`.

## 1. Product Intent

- The prototype MUST feel like a shipping mobile app during a guided demo.
- The prototype MUST prefer perceived polish over backend completeness.
- The prototype MUST support one end-to-end interactive primary flow with persisted state.
- The prototype MUST be resettable or jumpable to preset states in under 2 seconds.
- The prototype MUST NOT expose incomplete flows, dead controls, or visible "not implemented" moments in the active demo path.

## 2. Scope Boundaries

### In Scope

- first-run personalization
- home launchpad
- question engine
- module completion
- demo presets and reset tools
- curated static text content
- one playable module plus three preview-only cards
- accessibility hygiene for the active demo path

### Out Of Scope

- module detail screen
- progress/profile screen
- standalone daily challenge screen
- full diagnostic onboarding
- badge system as a required computed feature
- dedicated sound-system implementation
- dedicated motion-polish wave
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
- The app MUST route first-launch users to first-run personalization and returning users to home.
- The app MUST support reset without a full page reload.

## 4. State Contract

The app store MUST contain enough state to support:
- user profile: display name and selected goal
- XP total and derived level
- lightweight module progress keyed by `moduleId`
- question progress keyed by `questionId`
- demo-control preferences for reduced motion / skip animations and grid overlay
- first-run completion state

The store MUST expose:
- `resetApp()`
- actions for answering questions
- actions for applying demo presets
- actions for updating demo-control preferences
- actions for first-run personalization progression

Existing richer store state MAY remain in the repo, but frontend work in this packet MUST NOT depend on de-scoped surfaces.

## 5. Screen Contracts

### Splash / First Launch Detection

- MUST detect whether first-run personalization is complete.
- MUST route immediately to first-run personalization or home.
- MUST NOT require an intermediate splash interaction.

### First-Run Personalization

- MUST collect display name and one goal selection.
- MUST persist progress across reload.
- MUST feel fast and lightweight rather than like a long onboarding flow.
- MUST route directly to home when complete.
- MUST NOT require sample questions, diagnostics, avatar selection, or recommendations.

### Home / Launchpad

- MUST be the default post-personalization screen.
- MUST show greeting and current date.
- MUST make the playable Foundations entry the primary CTA above the fold.
- MUST show enough progress context to feel personalized, such as XP and/or level.
- MUST show all four module cards, with three clearly marked as preview-only.
- MUST reflect real persisted state on reload.
- Optional supporting surfaces such as streak, daily, recent activity, and heatmap MAY appear only if they strengthen the core loop and do not become blockers.

### Question Screen

- MUST support the text multiple-choice demo question flow through one shared shell.
- MUST preserve in-progress selection if the app is backgrounded or reloaded before submit.
- MUST disable submit until an option is selected.
- MUST preserve answered state once submitted.
- MUST show explanation after every submit.
- MUST advance to the next unanswered question or module completion.

### Module Completion

- MUST trigger immediately after the final module question result flow.
- MUST be a full-screen takeover, not a toast.
- MUST show a clear completion message and back-home CTA.
- MAY use fixed celebration copy instead of fully computed reward summaries.

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
- Module completion MAY award a fixed completion bonus if already supported by the store contract, but the UI MUST NOT depend on advanced reward plumbing.

## 7. Module System Contract

- There MUST be exactly four modules:
  - Foundations
  - Conditional Reasoning
  - Logical Fallacies
  - Visual Patterns
- Foundations MUST be the only playable module in the reduced demo build.
- Foundations MUST contain exactly 5 authored questions.
- The other three modules MUST remain visible as preview cards.
- Preview cards MUST be clearly marked as non-playable and MUST NOT use locked progression behavior.
- Home MUST route directly into Foundations question flow without a separate module-detail screen.

## 8. Question Bank Contract

- Questions MUST be static build-time data.
- The authored playable-module question bank MUST contain exactly 5 questions total.
- Every question MUST have exactly one defensible correct answer.
- Every question MUST include a concise explanation.

## 9. XP And Progress Rules

- Level MUST be derived as `floor(XP / 200) + 1`.
- XP displays SHOULD update smoothly in the UI when practical on implemented surfaces.
- The reduced demo packet does not require full badge, daily, or streak breadth as release gates.

## 10. Demo Controls Contract

- Demo Controls MUST be reachable by keyboard shortcut and by gear icon.
- The menu MUST include:
  - reset to first launch
  - preset states
  - skip animations toggle
  - grid overlay toggle
  - app version
- Preset loading MUST route the user to the most relevant active screen for that state.
- Reset MUST clear persisted state and route to first-run personalization immediately.

## 11. Accessibility Contract

- Primary flows MUST be keyboard operable.
- Semantic HTML MUST be used for interactive controls.
- Focus states MUST be visible.
- Contrast MUST satisfy normal in-app readability expectations for the approved palette.
- Reduced motion mode MUST disable nonessential motion in implemented surfaces.

## 12. Demo Readiness Gates

The prototype is not demo-ready unless:
- no console errors occur in the core loop
- no visible layout shift occurs during the active demo screens
- initial load appears styled on first paint
- reset and preset flows work quickly and repeatably
- the demo can proceed from first-run personalization to home to question to completion without workaround narration
