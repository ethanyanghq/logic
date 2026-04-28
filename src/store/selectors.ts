import {
  getDailyHistoryWindow,
  type DailyChallengeHistoryEntry,
} from "@/lib/daily";
import { getReferenceLocalDate } from "./state";
import { getHoursSince, type LocalDateString } from "@/lib/dates";
import {
  getRecommendedStartingModule,
} from "@/lib/onboarding";
import {
  getEffectiveMotionEnabled,
  getEffectiveSoundEnabled,
} from "@/lib/preferences";
import { getLevelFromXp } from "@/lib/xp";
import type { AppStoreState, QuestionId, QuestionProgress } from "./types";

export const selectHasHydrated = (state: AppStoreState) => state.hasHydrated;

export const selectHasCompletedProfile = (state: AppStoreState) =>
  Boolean(
    state.profile.displayName &&
      state.profile.avatarId &&
      state.profile.selectedGoal &&
      state.profile.baselineLevel !== null &&
      state.onboarding.profileCompleted,
  );

export const selectShouldStartInOnboarding = (state: AppStoreState) =>
  !selectHasCompletedProfile(state);

export const selectXp = (state: AppStoreState) => state.progress.xp;

export const selectLevel = (state: AppStoreState) =>
  getLevelFromXp(state.progress.xp);

export const selectRecommendedStartingModuleId = (state: AppStoreState) =>
  state.profile.recommendedModuleId ??
  (state.profile.baselineLevel !== null
    ? getRecommendedStartingModule(state.profile.baselineLevel)
    : null);

export const selectEffectiveSoundEnabled = (state: AppStoreState) =>
  getEffectiveSoundEnabled(state.preferences);

export const selectEffectiveMotionEnabled = (state: AppStoreState) =>
  getEffectiveMotionEnabled(state.preferences);

export const selectQuestionProgress =
  (questionId: QuestionId) =>
  (state: AppStoreState): QuestionProgress | null =>
    state.questionProgress[questionId] ?? null;

export const selectDailyChallengeHistoryWindow = (
  state: AppStoreState,
  localDate?: LocalDateString,
): Array<DailyChallengeHistoryEntry<QuestionId> | null> =>
  getDailyHistoryWindow(
    state.dailyChallenge,
    getReferenceLocalDate(localDate),
  );

export const selectIsStreakAtRisk = (
  state: AppStoreState,
  referenceTime?: Date | number | string,
) => {
  if (!state.progress.lastAnsweredAt || !state.progress.lastActiveDate) {
    return false;
  }

  const today = getReferenceLocalDate(undefined, referenceTime ?? new Date());
  if (state.progress.lastActiveDate === today) {
    return false;
  }

  return getHoursSince(
    state.progress.lastAnsweredAt,
    referenceTime ?? new Date(),
  ) > 18;
};

