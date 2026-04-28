import {
  getHoursSince,
  getLocalDateDistanceInDays,
  getPriorLocalDates,
  type LocalDateString,
} from "./dates";

export const STREAK_MILESTONES = [3, 7, 14, 30, 100] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

export type StreakSnapshot = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: LocalDateString | null;
  availableFreezes: number;
};

export type RecordedStreakActivity = StreakSnapshot & {
  milestoneReached: StreakMilestone | null;
  usedFreeze: boolean;
  reset: boolean;
};

export function createInitialStreakSnapshot(): StreakSnapshot {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    availableFreezes: 0,
  };
}

export function recordStreakActivity(
  snapshot: StreakSnapshot,
  activityDate: LocalDateString,
): RecordedStreakActivity {
  if (snapshot.lastActiveDate === activityDate) {
    return {
      ...snapshot,
      milestoneReached: null,
      usedFreeze: false,
      reset: false,
    };
  }

  if (snapshot.lastActiveDate === null) {
    return finalizeRecordedActivity(
      {
        ...snapshot,
        currentStreak: 1,
        longestStreak: Math.max(snapshot.longestStreak, 1),
        lastActiveDate: activityDate,
      },
      false,
      false,
    );
  }

  const dayDistance = getLocalDateDistanceInDays(
    snapshot.lastActiveDate,
    activityDate,
  );

  if (dayDistance <= 0) {
    return {
      ...snapshot,
      milestoneReached: null,
      usedFreeze: false,
      reset: false,
    };
  }

  if (dayDistance === 1) {
    return finalizeRecordedActivity(
      {
        ...snapshot,
        currentStreak: snapshot.currentStreak + 1,
        longestStreak: Math.max(
          snapshot.longestStreak,
          snapshot.currentStreak + 1,
        ),
        lastActiveDate: activityDate,
      },
      false,
      false,
    );
  }

  if (dayDistance === 2 && snapshot.availableFreezes > 0) {
    return finalizeRecordedActivity(
      {
        ...snapshot,
        currentStreak: snapshot.currentStreak + 1,
        longestStreak: Math.max(
          snapshot.longestStreak,
          snapshot.currentStreak + 1,
        ),
        lastActiveDate: activityDate,
        availableFreezes: snapshot.availableFreezes - 1,
      },
      true,
      false,
    );
  }

  return finalizeRecordedActivity(
    {
      ...snapshot,
      currentStreak: 1,
      longestStreak: Math.max(snapshot.longestStreak, 1),
      lastActiveDate: activityDate,
    },
    false,
    true,
  );
}

export function recomputeStreakForDate(
  snapshot: StreakSnapshot,
  referenceDate: LocalDateString,
): StreakSnapshot {
  if (snapshot.lastActiveDate === null) {
    return snapshot;
  }

  const dayDistance = getLocalDateDistanceInDays(
    snapshot.lastActiveDate,
    referenceDate,
  );

  if (dayDistance <= 1) {
    return snapshot;
  }

  if (dayDistance === 2 && snapshot.availableFreezes > 0) {
    const bridgedActiveDate =
      getPriorLocalDates(referenceDate, 2).at(-1) ?? snapshot.lastActiveDate;

    return {
      ...snapshot,
      availableFreezes: snapshot.availableFreezes - 1,
      lastActiveDate: bridgedActiveDate,
    };
  }

  return {
    ...snapshot,
    currentStreak: 0,
    lastActiveDate: snapshot.lastActiveDate,
  };
}

export function isStreakAtRisk(input: {
  lastAnsweredAt: string | null;
  lastActiveDate: LocalDateString | null;
  today: LocalDateString;
  referenceTime?: Date | number | string;
}): boolean {
  if (input.lastAnsweredAt === null || input.lastActiveDate === null) {
    return false;
  }

  if (input.lastActiveDate === input.today) {
    return false;
  }

  return getHoursSince(
    input.lastAnsweredAt,
    input.referenceTime ?? new Date(),
  ) > 18;
}

function finalizeRecordedActivity(
  snapshot: StreakSnapshot,
  usedFreeze: boolean,
  reset: boolean,
): RecordedStreakActivity {
  const milestoneReached =
    STREAK_MILESTONES.find((milestone) => milestone === snapshot.currentStreak) ??
    null;

  return {
    ...snapshot,
    milestoneReached,
    usedFreeze,
    reset,
  };
}
