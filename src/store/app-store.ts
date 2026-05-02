import { useStore } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
  ensureDailyChallengeForDate,
  recordDailyChallengeResult,
} from "@/lib/daily";
import { toIsoTimestamp, type LocalDateString } from "@/lib/dates";
import type { ModuleId } from "@/lib/modules";
import {
  getBaselineLevelFromDiagnosticScore,
  getRecommendedStartingModule,
} from "@/lib/onboarding";
import { type DemoPreferences } from "@/lib/preferences";
import {
  createInitialStreakSnapshot,
  recordStreakActivity,
  recomputeStreakForDate,
} from "@/lib/streak";
import {
  addXp,
  getLevelFromXp,
  getModuleCompletionXpAward,
  getQuestionXpAward,
  type QuestionRewardContext,
} from "@/lib/xp";
import {
  APP_STORE_STORAGE_KEY,
  APP_STORE_STORAGE_VERSION,
  createEmptyQuestionProgress,
  createInitialAppStoreState,
  getModuleProgressRecord,
  getReferenceLocalDate,
  mergeAppStoreState,
  normalizePersistedAppStoreState,
} from "./state";
import type {
  AnsweredQuestionAttempt,
  AppStorePreset,
  AppStoreState,
  CompleteModuleResult,
  OnboardingState,
  PersistedAppStoreState,
  QuestionProgress,
  SubmitQuestionAnswerInput,
  SubmitQuestionAnswerResult,
} from "./types";

type AppStoreOptions = {
  storage?: StateStorage;
};

export function createAppStore(options: AppStoreOptions = {}) {
  return createStore<AppStoreState>()(
    persist(
      (set, get, api) => ({
        ...createInitialAppStoreState(),
        hasHydrated: false,
        lastAppliedPresetKey: null,
        finishHydration: () => {
          set({ hasHydrated: true });
        },
        resetApp: () => {
          const resetState = createInitialAppStoreState();
          set({
            ...resetState,
            hasHydrated: true,
            lastAppliedPresetKey: null,
          });
          api.persist?.clearStorage();
        },
        applyPreset: (preset: AppStorePreset) => {
          const presetState = mergeAppStoreState(
            createInitialAppStoreState(),
            preset.state,
          );

          set({
            ...presetState,
            hasHydrated: true,
            lastAppliedPresetKey: preset.key,
          });
        },
        setQuestionSelection: (input) => {
          set((state) => {
            const questionProgress = getQuestionProgressRecord(
              state.questionProgress,
              input.questionId,
            );
            if (hasAnsweredQuestion(questionProgress, input.context, input.localDate ?? null)) {
              return {};
            }

            return {
              questionProgress: {
                ...state.questionProgress,
                [input.questionId]: {
                  ...questionProgress,
                  draft: {
                    context: input.context,
                    moduleId: input.moduleId ?? null,
                    dailyDate: input.localDate ?? null,
                    selectedOptionIndex: input.selectedOptionIndex,
                    updatedAt: toIsoTimestamp(input.updatedAt ?? new Date()),
                  },
                },
              },
            };
          });
        },
        clearQuestionSelection: (questionId, context) => {
          set((state) => {
            const questionProgress = state.questionProgress[questionId];
            if (!questionProgress?.draft) {
              return {};
            }

            if (context && questionProgress.draft.context !== context) {
              return {};
            }

            return {
              questionProgress: {
                ...state.questionProgress,
                [questionId]: {
                  ...questionProgress,
                  draft: null,
                },
              },
            };
          });
        },
        submitQuestionAnswer: (input: SubmitQuestionAnswerInput) => {
          const currentState = get();
          const answeredAt = toIsoTimestamp(input.answeredAt ?? new Date());
          const localDate = getReferenceLocalDate(input.localDate, answeredAt);
          const existingProgress = getQuestionProgressRecord(
            currentState.questionProgress,
            input.questionId,
          );
          const existingAttempt = getAnsweredQuestionAttempt(
            existingProgress,
            input.context,
            localDate,
          );

          if (existingAttempt) {
            return buildSubmitQuestionAnswerResult(
              currentState,
              input,
              localDate,
              existingAttempt,
              null,
              false,
            );
          }

          const isCorrect = input.selectedOptionIndex === input.correctIndex;
          const awardedXp = getQuestionXpAward({
            context: input.context,
            isCorrect,
          });
          const attempt: AnsweredQuestionAttempt = {
            context: input.context,
            moduleId: input.moduleId ?? null,
            localDate,
            selectedOptionIndex: input.selectedOptionIndex,
            correctIndex: input.correctIndex,
            isCorrect,
            answeredAt,
            awardedXp,
          };

          const nextXp = addXp(currentState.progress.xp, awardedXp);
          const nextLevel = getLevelFromXp(nextXp);
          const recordedStreak = recordStreakActivity(
            {
              ...createInitialStreakSnapshot(),
              currentStreak: currentState.progress.currentStreak,
              longestStreak: currentState.progress.longestStreak,
              lastActiveDate: currentState.progress.lastActiveDate,
              availableFreezes: currentState.progress.availableStreakFreezes,
            },
            localDate,
          );
          const shouldUnlockFreeze =
            recordedStreak.milestoneReached === 7 &&
            !currentState.progress.hasUnlockedStreakFreeze;
          const availableStreakFreezes = shouldUnlockFreeze
            ? 1
            : recordedStreak.availableFreezes;

          const nextQuestionProgress: QuestionProgress = {
            ...existingProgress,
            draft: null,
            moduleAttempt:
              input.context === "module"
                ? attempt
                : existingProgress.moduleAttempt,
            onboardingSampleAttempt:
              input.context === "onboarding-sample"
                ? attempt
                : existingProgress.onboardingSampleAttempt,
            onboardingDiagnosticAttempt:
              input.context === "onboarding-diagnostic"
                ? attempt
                : existingProgress.onboardingDiagnosticAttempt,
            dailyAttempts:
              input.context === "daily"
                ? {
                    ...existingProgress.dailyAttempts,
                    [localDate]: attempt,
                  }
                : existingProgress.dailyAttempts,
          };

          const nextQuestionProgressMap = {
            ...currentState.questionProgress,
            [input.questionId]: nextQuestionProgress,
          };

          const nextModuleProgress =
            input.context === "module" && input.moduleId
              ? updateModuleProgressAfterAnswer(
                  currentState.moduleProgress,
                  input.moduleId,
                  input.questionId,
                  isCorrect,
                )
              : currentState.moduleProgress;

          const nextOnboarding = updateOnboardingAfterAnswer(
            currentState,
            input,
            isCorrect,
          );

          const nextDailyChallenge =
            input.context === "daily"
              ? recordDailyChallengeResult(currentState.dailyChallenge, {
                  localDate,
                  questionId: input.questionId,
                  correct: isCorrect,
                })
              : currentState.dailyChallenge;

          const nextActivityLog = [
            ...currentState.activityLog,
            {
              id: createActivityId("question-answered", input.questionId, answeredAt),
              type: "question-answered" as const,
              questionId: input.questionId,
              context: input.context,
              moduleId: input.moduleId ?? null,
              localDate,
              occurredAt: answeredAt,
              isCorrect,
              awardedXp,
            },
          ];

          set({
            profile: currentState.profile,
            progress: {
              ...currentState.progress,
              xp: nextXp,
              currentStreak: recordedStreak.currentStreak,
              longestStreak: recordedStreak.longestStreak,
              lastActiveDate: recordedStreak.lastActiveDate,
              lastAnsweredAt: answeredAt,
              availableStreakFreezes,
              hasUnlockedStreakFreeze:
                currentState.progress.hasUnlockedStreakFreeze || shouldUnlockFreeze,
            },
            moduleProgress: nextModuleProgress,
            questionProgress: nextQuestionProgressMap,
            earnedBadgeIds: currentState.earnedBadgeIds,
            dailyChallenge: nextDailyChallenge,
            preferences: currentState.preferences,
            onboarding: nextOnboarding,
            activityLog: nextActivityLog,
            hasHydrated: currentState.hasHydrated,
            lastAppliedPresetKey: currentState.lastAppliedPresetKey,
          });

          return {
            questionId: input.questionId,
            context: input.context,
            moduleId: input.moduleId ?? null,
            localDate,
            isCorrect,
            awardedXp,
            newXpTotal: nextXp,
            newLevel: nextLevel,
            streak: {
              current: recordedStreak.currentStreak,
              longest: recordedStreak.longestStreak,
              milestoneReached: recordedStreak.milestoneReached,
              usedFreeze: recordedStreak.usedFreeze,
            },
          };
        },
        awardXp: (amount: number) => {
          const nextXp = addXp(get().progress.xp, amount);
          set((state) => ({
            progress: {
              ...state.progress,
              xp: nextXp,
            },
          }));
          return nextXp;
        },
        recomputeStreak: (referenceDate) => {
          const state = get();
          const nextStreak = recomputeStreakForDate(
            {
              currentStreak: state.progress.currentStreak,
              longestStreak: state.progress.longestStreak,
              lastActiveDate: state.progress.lastActiveDate,
              availableFreezes: state.progress.availableStreakFreezes,
            },
            getReferenceLocalDate(referenceDate),
          );

          set({
            progress: {
              ...state.progress,
              currentStreak: nextStreak.currentStreak,
              longestStreak: nextStreak.longestStreak,
              lastActiveDate: nextStreak.lastActiveDate,
              availableStreakFreezes: nextStreak.availableFreezes,
            },
          });
        },
        syncDailyChallenge: (eligibleQuestionIds, localDate) => {
          const state = get();
          const resolvedDate = getReferenceLocalDate(localDate);
          const nextDailyChallenge = ensureDailyChallengeForDate(
            state.dailyChallenge,
            {
              localDate: resolvedDate,
              eligibleQuestionIds,
            },
          );

          set({
            dailyChallenge: nextDailyChallenge,
          });

          return nextDailyChallenge.questionId;
        },
        updateDemoPreferences: (patch: Partial<DemoPreferences>) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...patch,
            },
          }));
        },
        completeWelcomeStep: () => {
          set((state) => ({
            onboarding: {
              ...state.onboarding,
              stage: "goal",
              welcomeCompleted: true,
            },
          }));
        },
        setOnboardingStage: (stage) => {
          set((state) => ({
            onboarding: {
              ...state.onboarding,
              stage,
            },
          }));
        },
        setOnboardingDisplayName: (displayName) => {
          set((state) => ({
            profile: {
              ...state.profile,
              displayName,
            },
          }));
        },
        setOnboardingGoal: (goal) => {
          set((state) => ({
            profile: {
              ...state.profile,
              selectedGoal: goal,
            },
            onboarding: {
              ...state.onboarding,
              stage: "profile",
              goalSelected: true,
            },
          }));
        },
        setOnboardingSampleQuestion: (questionId) => {
          set((state) => ({
            onboarding: {
              ...state.onboarding,
              sampleQuestionId: questionId,
            },
          }));
        },
        setOnboardingDiagnosticQuestionIds: (questionIds) => {
          set((state) => ({
            onboarding: {
              ...state.onboarding,
              diagnosticQuestionIds: [...questionIds],
            },
          }));
        },
        completeOnboardingProfile: (input) => {
          const state = get();
          const completedAt = toIsoTimestamp(input.completedAt ?? new Date());
          const localDate = getReferenceLocalDate(undefined, completedAt);
          const baselineLevel = getBaselineLevelFromDiagnosticScore(
            state.onboarding.diagnosticCorrectCount,
          );
          const recommendedModuleId =
            getRecommendedStartingModule(baselineLevel);

          set({
            profile: {
              ...state.profile,
              displayName: input.displayName.trim(),
              avatarId: input.avatarId,
              baselineLevel,
              recommendedModuleId,
              memberSinceDate: localDate,
            },
            onboarding: {
              ...state.onboarding,
              stage: "complete",
              profileCompleted: true,
              homeRevealPending: true,
            },
          });

          return {
            baselineLevel,
            recommendedModuleId,
          };
        },
        markOnboardingHomeRevealSeen: () => {
          set((state) => ({
            onboarding: {
              ...state.onboarding,
              homeRevealPending: false,
            },
          }));
        },
        completeModule: (input): CompleteModuleResult | null => {
          const state = get();
          const currentModule = state.moduleProgress[input.moduleId];
          if (currentModule?.completed) {
            return null;
          }

          const completedAt = toIsoTimestamp(input.completedAt ?? new Date());
          const localDate = getReferenceLocalDate(undefined, completedAt);
          const awardedXp =
            input.awardXp === false ? 0 : getModuleCompletionXpAward();
          const nextXp = addXp(state.progress.xp, awardedXp);

          set({
            progress: {
              ...state.progress,
              xp: nextXp,
            },
            moduleProgress: {
              ...state.moduleProgress,
              [input.moduleId]: {
                ...getModuleProgressRecord(state.moduleProgress, input.moduleId),
                completed: true,
                completedAt,
              },
            },
            activityLog: [
              ...state.activityLog,
              {
                id: createActivityId(
                  "module-completed",
                  input.moduleId,
                  completedAt,
                ),
                type: "module-completed",
                moduleId: input.moduleId,
                localDate,
                occurredAt: completedAt,
                awardedXp,
              },
            ],
          });

          return {
            moduleId: input.moduleId,
            awardedXp,
            newXpTotal: nextXp,
            completedAt,
          };
        },
      }),
      {
        name: APP_STORE_STORAGE_KEY,
        version: APP_STORE_STORAGE_VERSION,
        storage: createJSONStorage(() => options.storage ?? createMemoryStorage()),
        partialize: (state): PersistedAppStoreState => ({
          profile: state.profile,
          progress: state.progress,
          moduleProgress: state.moduleProgress,
          questionProgress: state.questionProgress,
          earnedBadgeIds: state.earnedBadgeIds,
          dailyChallenge: state.dailyChallenge,
          preferences: state.preferences,
          onboarding: state.onboarding,
          activityLog: state.activityLog,
        }),
        migrate: (persistedState) =>
          normalizePersistedAppStoreState(persistedState),
        onRehydrateStorage: () => (state) => {
          state?.finishHydration();
        },
      },
    ),
  );
}

export const appStore = createAppStore({
  storage: createBrowserStorage(),
});

export function useAppStore<T>(selector: (state: AppStoreState) => T): T {
  return useStore(appStore, selector);
}

function createBrowserStorage(): StateStorage {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return createMemoryStorage();
}

function createMemoryStorage(): StateStorage {
  const storage = new Map<string, string>();

  return {
    getItem: (name) => storage.get(name) ?? null,
    setItem: (name, value) => {
      storage.set(name, value);
    },
    removeItem: (name) => {
      storage.delete(name);
    },
  };
}

function getQuestionProgressRecord(
  questionProgress: AppStoreState["questionProgress"],
  questionId: string,
): QuestionProgress {
  return questionProgress[questionId] ?? createEmptyQuestionProgress();
}

function hasAnsweredQuestion(
  questionProgress: QuestionProgress,
  context: QuestionRewardContext,
  localDate: LocalDateString | null,
): boolean {
  return getAnsweredQuestionAttempt(questionProgress, context, localDate) !== null;
}

function getAnsweredQuestionAttempt(
  questionProgress: QuestionProgress,
  context: QuestionRewardContext,
  localDate: LocalDateString | null,
): AnsweredQuestionAttempt | null {
  if (context === "module") {
    return questionProgress.moduleAttempt;
  }

  if (context === "onboarding-sample") {
    return questionProgress.onboardingSampleAttempt;
  }

  if (context === "onboarding-diagnostic") {
    return questionProgress.onboardingDiagnosticAttempt;
  }

  return localDate ? questionProgress.dailyAttempts[localDate] ?? null : null;
}

function updateModuleProgressAfterAnswer(
  currentModuleProgress: AppStoreState["moduleProgress"],
  moduleId: ModuleId,
  questionId: string,
  isCorrect: boolean,
) {
  const moduleProgress = getModuleProgressRecord(
    currentModuleProgress,
    moduleId,
  );
  const answeredQuestionIds = moduleProgress.answeredQuestionIds.includes(questionId)
    ? moduleProgress.answeredQuestionIds
    : [...moduleProgress.answeredQuestionIds, questionId];
  const correctQuestionIds = isCorrect
    ? moduleProgress.correctQuestionIds.includes(questionId)
      ? moduleProgress.correctQuestionIds
      : [...moduleProgress.correctQuestionIds, questionId]
    : moduleProgress.correctQuestionIds.filter((id) => id !== questionId);

  return {
    ...currentModuleProgress,
    [moduleId]: {
      ...moduleProgress,
      answeredQuestionIds,
      correctQuestionIds,
    },
  };
}

function updateOnboardingAfterAnswer(
  state: AppStoreState,
  input: SubmitQuestionAnswerInput,
  isCorrect: boolean,
): OnboardingState {
  if (input.context === "onboarding-sample") {
    return {
      ...state.onboarding,
      stage: "diagnostic" as const,
      sampleCompleted: true,
    };
  }

  if (input.context !== "onboarding-diagnostic") {
    return state.onboarding;
  }

  const existingProgress = getQuestionProgressRecord(
    state.questionProgress,
    input.questionId,
  );
  const existingAttempt = existingProgress.onboardingDiagnosticAttempt;
  const diagnosticCompletedCount = existingAttempt
    ? state.onboarding.diagnosticCompletedCount
    : state.onboarding.diagnosticCompletedCount + 1;
  const diagnosticCorrectCount =
    existingAttempt || !isCorrect
      ? state.onboarding.diagnosticCorrectCount
      : state.onboarding.diagnosticCorrectCount + 1;
  const nextStage =
    diagnosticCompletedCount >= state.onboarding.diagnosticQuestionIds.length &&
    state.onboarding.diagnosticQuestionIds.length > 0
      ? "profile"
      : "diagnostic";

  return {
    ...state.onboarding,
    stage: nextStage,
    diagnosticCompletedCount,
    diagnosticCorrectCount,
  };
}

function buildSubmitQuestionAnswerResult(
  state: AppStoreState,
  input: SubmitQuestionAnswerInput,
  localDate: LocalDateString,
  attempt: AnsweredQuestionAttempt,
  milestoneReached: number | null,
  usedFreeze: boolean,
): SubmitQuestionAnswerResult {
  return {
    questionId: input.questionId,
    context: input.context,
    moduleId: input.moduleId ?? null,
    localDate,
    isCorrect: attempt.isCorrect,
    awardedXp: attempt.awardedXp,
    newXpTotal: state.progress.xp,
    newLevel: getLevelFromXp(state.progress.xp),
    streak: {
      current: state.progress.currentStreak,
      longest: state.progress.longestStreak,
      milestoneReached,
      usedFreeze,
    },
  };
}

function createActivityId(type: string, entityId: string, occurredAt: string): string {
  return `${type}:${entityId}:${occurredAt}`;
}
