# Codex To Claude Handoff

This file is maintained by Codex during backend task execution and read by Claude Code before frontend work.

Update the relevant task section in place after each backend task lands. Keep entries concise and contract-focused.

For each completed section, capture:
- what changed
- what was verified
- the selectors, actions, schema shapes, preset payloads, or other contracts frontend must consume
- any known caveats or open integration notes

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
  No preset catalog or canonical content data landed in T004; `applyPreset` already accepts normalized partial state patches and T016 can supply the five real presets on top of this contract.
  `selectHasHydrated` should gate first-launch routing so the UI does not decide onboarding vs home before persisted state is available.
  Streak-freeze recomputation consumes the freeze by bridging the missed day only; it must not mark the current day as active before an answer is submitted.

## T012

- Status: Pending
- What changed:
- Verified:
- Frontend contracts:
- Notes:

## T013

- Status: Pending
- What changed:
- Verified:
- Frontend contracts:
- Notes:

## T016

- Status: Pending
- What changed:
- Verified:
- Frontend contracts:
- Notes:
