import { createInitialDailyChallengeState } from "@/lib/daily";
import { toLocalDateString, type LocalDateString } from "@/lib/dates";
import { createDefaultDemoPreferences } from "@/lib/preferences";
import { MODULE_IDS, type ModuleId } from "@/lib/modules";
import type {
  DeepPartial,
  ModuleProgress,
  PersistedAppStoreState,
  QuestionProgress,
} from "./types";

export const APP_STORE_STORAGE_KEY = "logic-app-v1";
export const APP_STORE_STORAGE_VERSION = 1;

export function createInitialAppStoreState(): PersistedAppStoreState {
  return {
    profile: {
      displayName: null,
      avatarId: null,
      selectedGoal: null,
      baselineLevel: null,
      recommendedModuleId: null,
      memberSinceDate: null,
    },
    progress: {
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      lastAnsweredAt: null,
      availableStreakFreezes: 0,
      hasUnlockedStreakFreeze: false,
    },
    moduleProgress: createInitialModuleProgress(),
    questionProgress: {},
    earnedBadgeIds: [],
    dailyChallenge: createInitialDailyChallengeState(),
    preferences: createDefaultDemoPreferences(),
    onboarding: {
      stage: "welcome",
      welcomeCompleted: false,
      goalSelected: false,
      sampleQuestionId: null,
      sampleCompleted: false,
      diagnosticQuestionIds: [],
      diagnosticCompletedCount: 0,
      diagnosticCorrectCount: 0,
      profileCompleted: false,
      homeRevealPending: false,
    },
    activityLog: [],
  };
}

export function normalizePersistedAppStoreState(
  snapshot: unknown,
): PersistedAppStoreState {
  return mergeAppStoreState(createInitialAppStoreState(), snapshot);
}

export function mergeAppStoreState(
  baseState: PersistedAppStoreState,
  patch: unknown,
): PersistedAppStoreState {
  if (!isPlainObject(patch)) {
    return structuredClone(baseState);
  }

  return deepMerge(baseState, patch as DeepPartial<PersistedAppStoreState>);
}

export function createEmptyQuestionProgress(): QuestionProgress {
  return {
    draft: null,
    moduleAttempt: null,
    onboardingSampleAttempt: null,
    onboardingDiagnosticAttempt: null,
    dailyAttempts: {},
  };
}

export function getModuleProgressRecord(
  moduleProgress: Record<ModuleId, ModuleProgress>,
  moduleId: ModuleId,
): ModuleProgress {
  return (
    moduleProgress[moduleId] ?? {
      answeredQuestionIds: [],
      correctQuestionIds: [],
      completed: false,
      completedAt: null,
    }
  );
}

function createInitialModuleProgress(): Record<ModuleId, ModuleProgress> {
  return MODULE_IDS.reduce<Record<ModuleId, ModuleProgress>>((accumulator, moduleId) => {
    accumulator[moduleId] = {
      answeredQuestionIds: [],
      correctQuestionIds: [],
      completed: false,
      completedAt: null,
    };
    return accumulator;
  }, {} as Record<ModuleId, ModuleProgress>);
}

function deepMerge<T>(baseValue: T, patchValue: DeepPartial<T>): T {
  if (Array.isArray(baseValue)) {
    return (Array.isArray(patchValue)
      ? [...patchValue]
      : [...baseValue]) as T;
  }

  if (!isPlainObject(baseValue)) {
    return (patchValue ?? baseValue) as T;
  }

  const output: Record<string, unknown> = { ...baseValue };
  for (const key of Object.keys(patchValue as Record<string, unknown>)) {
    const patchEntry = (patchValue as Record<string, unknown>)[key];
    if (patchEntry === undefined) {
      continue;
    }

    const baseEntry = (baseValue as Record<string, unknown>)[key];
    if (Array.isArray(patchEntry)) {
      output[key] = [...patchEntry];
      continue;
    }

    if (patchEntry === null || !isPlainObject(patchEntry) || !isPlainObject(baseEntry)) {
      output[key] = patchEntry;
      continue;
    }

    output[key] = deepMerge(baseEntry, patchEntry);
  }

  return output as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getReferenceLocalDate(
  localDate?: LocalDateString | null,
  fallback: Date | number | string = new Date(),
): LocalDateString {
  return localDate ?? toLocalDateString(fallback);
}
