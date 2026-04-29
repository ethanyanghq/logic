# Codex To Claude Handoff

This file is maintained by Codex during backend task execution and read by Claude Code before frontend work.

Update the relevant task section in place after each backend task lands. Keep entries concise and contract-focused.

For each completed section, capture:
- what changed
- what was verified
- the selectors, actions, schema shapes, preset payloads, or other contracts frontend must consume
- any known caveats or open integration notes

## Current Blockers

- As of 2026-04-28, `src/App.tsx` is still the primitive-gallery placeholder rather than routed screen composition, so completed screen work under `src/screens/*` is not yet wired into the running app.
- As of 2026-04-28, the critical frontend blockers are now limited to `App.tsx` route/composition wiring and completion transition behavior.

## T004

- Status: Complete
- What changed:
  Added the persisted Zustand app store under `logic-app-v1` in `src/store/*` with versioned persistence, reset, preset application, typed onboarding/progress/daily/preferences state, and stable selectors/actions. Added pure backend helpers in `src/lib/*` for XP/level math, streak/date math, deterministic daily selection, onboarding baseline/recommendation rules, module IDs, and effective demo-control preference derivation.
- Verified:
  `npm run typecheck`
  `npm run build`
  Scripted store exercise covering onboarding progression, onboarding XP awards, diagnostic baseline level/recommendation, module answer submission, daily challenge sync + answer submission, demo-preference toggles, preset application, and reset without reload.
  Scripted persistence exercise covering persisted state surviving store recreation and reset clearing the persisted namespace before a fresh first-launch recreation.
- Frontend contracts:
  Persisted state shape: `profile`, `progress`, `moduleProgress`, `questionProgress`, `earnedBadgeIds`, `dailyChallenge`, `preferences`, `onboarding`, `activityLog`.
  Important question-progress rule: `questionProgress[questionId]` separates `moduleAttempt`, `onboardingSampleAttempt`, `onboardingDiagnosticAttempt`, `dailyAttempts[localDate]`, and `draft`, so daily/onboarding answers do not pollute module progress.
  Key selectors from `src/store/index.ts`: `selectHasHydrated`, `selectHasCompletedProfile`, `selectShouldStartInOnboarding`, `selectXp`, `selectLevel`, `selectRecommendedStartingModuleId`, `selectEffectiveSoundEnabled`, `selectEffectiveMotionEnabled`, `selectQuestionProgress(questionId)`, `selectDailyChallengeHistoryWindow`, `selectIsStreakAtRisk`.
  Key actions from `src/store/index.ts`: `resetApp`, `applyPreset`, `setQuestionSelection`, `clearQuestionSelection`, `submitQuestionAnswer`, `awardXp`, `recomputeStreak`, `syncDailyChallenge`, `updateDemoPreferences`, `completeWelcomeStep`, `setOnboardingStage`, `setOnboardingGoal`, `setOnboardingSampleQuestion`, `setOnboardingDiagnosticQuestionIds`, `completeOnboardingProfile`, `markOnboardingHomeRevealSeen`, `completeModule`.
  Demo preference fields: `soundEnabled`, `reducedMotion`, `skipAnimations`, `gridOverlayEnabled`. Consume effective behavior through selectors instead of recalculating in UI.
  Onboarding rules are encoded in helpers/store: diagnostic score `0-2 => level 1`, `3-4 => level 2`, `5 => level 3`; recommendations map to `foundations`, `conditional-reasoning`, `logical-fallacies`.
- Notes:
  No preset catalog or canonical content data landed in T004; `applyPreset` already accepts normalized partial state patches and T016 can supply the four reduced-packet presets on top of this contract.
  `selectHasHydrated` should gate first-launch routing so the UI does not decide onboarding vs home before persisted state is available.
  Streak-freeze recomputation consumes the freeze by bridging the missed day only; it must not mark the current day as active before an answer is submitted.
  For the reduced packet, frontend should prefer the smallest viable subset of this surface: first-run completion state, profile name/goal, XP/level, question progress, demo preferences, reset, and preset application. Daily/badge/deeper onboarding breadth is no longer a frontend dependency.

## T012

- Status: Complete
- What changed:
  Added the new backend-owned data layer under `src/data/content.ts` and `src/data/presets.ts`. `content.ts` now defines the canonical typed content pack for the reduced demo: exactly 4 module records in product order, exactly 5 authored Foundations text multiple-choice questions, module/question lookup exports, ordered playable-module question resolution, preview-module exports, and concept-primer copy on every module record. `presets.ts` now defines stable preset-route metadata and keys for the four reduced demo presets so frontend can consume one shared target contract before T016 lands the actual store snapshots.
- Verified:
  `npm run typecheck`
  `npm run build`
  Runtime smoke check with `node --experimental-strip-types` asserting 4 modules, exactly 1 playable module (`foundations`), exactly 5 authored questions, question order matching `questionIds`, preview modules carrying no question IDs, and 4 preset blueprints with the default playable target pointing at the first Foundations question.
- Frontend contracts:
  Import canonical authored content from `src/data/content.ts`; do not keep local placeholder module titles or sample questions.
  Primary exports:
  `MODULES`, `MODULE_CONTENT_SEQUENCE`, `MODULES_BY_ID`
  `QUESTIONS`, `QUESTIONS_BY_ID`
  `PLAYABLE_MODULE_ID`, `PLAYABLE_MODULE`, `PLAYABLE_MODULE_QUESTIONS`, `PREVIEW_MODULES`
  `getModuleById(moduleId)`, `getQuestionById(questionId)`, `getQuestionsForModule(moduleId)`
  Module record shape:
  `{ id, title, subtitle, difficulty, conceptPrimer, isPlayable, questionIds }`
  Question record shape:
  `{ id, moduleId, type: "multiple-choice-text", difficulty, prompt, options, correctIndex, explanation, tags, dailyEligible }`
  Canonical module rules now encoded in data:
  `foundations` is the only playable module and its `questionIds` resolve to 5 authored questions.
  `conditional-reasoning`, `logical-fallacies`, and `visual-patterns` are preview-only modules with empty `questionIds`.
  Import preset metadata from `src/data/presets.ts` if the UI needs labels/targets before T016:
  `DEMO_PRESET_KEYS`, `DEMO_PRESET_BLUEPRINTS`, `DEMO_PRESET_BLUEPRINTS_BY_KEY`, `DEFAULT_PLAYABLE_MODULE_TARGET`
  Preset target contract:
  `onboarding`
  `home`
  `question` with `{ moduleId, questionId }`
  `completion` with `{ moduleId }`
- Notes:
  T012 intentionally does not ship the actual preset state payloads; that remains T016. The new preset file establishes the stable metadata/target contract only, so frontend should not assume `AppStorePreset.state` snapshots exist there yet.

## T013

- Status: Pending
- What changed:
- Verified:
- Frontend contracts:
- Notes:
  This task is de-scoped by the reduced core-loop contract and is no longer a blocker for active frontend work.

## T016

- Status: Complete
- What changed:
  Added the canonical reduced-demo preset catalog in `src/data/presets.ts` with backend-owned shallow state snapshots for all 4 required presets: `fresh-user`, `mid-foundations`, `completion-ready`, and `power-user`. The file now exports both metadata and actual payloads through `DEMO_PRESETS`, `DEMO_PRESETS_BY_KEY`, `getDemoPresetByKey`, and the existing blueprint exports. Added store-side preset loader helpers in `src/store/preset-loaders.ts` and re-exported them from `src/store/index.ts` so UI can load a preset by key without reconstructing state locally.
- Verified:
  `npm run typecheck`
  `npm run build`
  Bundled runtime smoke check with local `esbuild` validating all 4 presets, preset-key lookup, store-loader dispatch, route-target coherence, answered/unanswered question boundaries, completion flags, XP totals, streak fields, and sub-1-second load/lookup time (`0.04ms` in the scripted check).
- Frontend contracts:
  Import preset metadata or payloads from `src/data/presets.ts`:
  `DEMO_PRESET_KEYS`
  `DEMO_PRESET_BLUEPRINTS`, `DEMO_PRESET_BLUEPRINTS_BY_KEY`
  `DEMO_PRESETS`, `DEMO_PRESETS_BY_KEY`
  `getDemoPresetByKey(presetKey)`
  Import loader helpers from `src/store`:
  `loadDemoPreset(store, presetKey)`
  `loadFreshUserPreset(store)`
  `loadMidFoundationsPreset(store)`
  `loadCompletionReadyPreset(store)`
  `loadPowerUserPreset(store)`
  Loader contract:
  pass `appStore` (or any store exposing `getState().applyPreset`) plus a preset key
  the loader applies the backend-owned preset patch through `applyPreset`
  the loader returns the same preset definition, including `target`, so UI can route after load without duplicating preset metadata
  Exact preset-opening contract for active screens:
  `fresh-user`: call `loadFreshUserPreset(appStore)` or `loadDemoPreset(appStore, "fresh-user")`, then route to `{ screen: "onboarding" }`
  `mid-foundations`: call `loadMidFoundationsPreset(appStore)` or `loadDemoPreset(appStore, "mid-foundations")`, then route to `{ screen: "question", moduleId: "foundations", questionId: "foundations-q03" }`
  `completion-ready`: call `loadCompletionReadyPreset(appStore)` or `loadDemoPreset(appStore, "completion-ready")`, then route to `{ screen: "question", moduleId: "foundations", questionId: "foundations-q05" }`
  `power-user`: call `loadPowerUserPreset(appStore)` or `loadDemoPreset(appStore, "power-user")`, then route to `{ screen: "home" }`
  Preset state details frontend can rely on:
  `fresh-user` keeps `onboarding.profileCompleted = false` and blank profile fields
  `mid-foundations` has `foundations-q01` and `foundations-q02` answered, `foundations-q03` still unanswered with a saved draft selection, and `xp = 12`
  `completion-ready` has `foundations-q01` through `foundations-q04` answered, `foundations-q05` unanswered, module not completed, and `xp = 32`
  `power-user` has Foundations fully completed, `xp = 275`, `currentStreak = 9`, `hasUnlockedStreakFreeze = true`, and current daily history on `2026-04-28`
- Notes:
  Presets remain plain shallow patches merged over the canonical initial store state; UI must not mutate or redefine the preset payloads locally.
  Target routing stays in frontend ownership: backend returns screen identifiers and canonical route payload only; it does not push navigation itself.
