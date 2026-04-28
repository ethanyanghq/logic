import { getPriorLocalDates, type LocalDateString } from "./dates";

export type DailyChallengeHistoryEntry<TQuestionId extends string = string> = {
  date: LocalDateString;
  questionId: TQuestionId;
  completed: boolean;
  correct: boolean | null;
};

export type DailyChallengeSnapshot<TQuestionId extends string = string> = {
  date: LocalDateString | null;
  questionId: TQuestionId | null;
  completed: boolean;
  correct: boolean | null;
  history: Record<LocalDateString, DailyChallengeHistoryEntry<TQuestionId>>;
};

export function createInitialDailyChallengeState<
  TQuestionId extends string = string,
>(): DailyChallengeSnapshot<TQuestionId> {
  return {
    date: null,
    questionId: null,
    completed: false,
    correct: null,
    history: {},
  };
}

export function hashLocalDate(localDate: LocalDateString): number {
  let hash = 5381;

  for (const char of localDate) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }

  return Math.abs(hash >>> 0);
}

export function selectDailyQuestionId<TQuestionId extends string>(
  localDate: LocalDateString,
  eligibleQuestionIds: readonly TQuestionId[],
): TQuestionId | null {
  if (eligibleQuestionIds.length === 0) {
    return null;
  }

  return eligibleQuestionIds[hashLocalDate(localDate) % eligibleQuestionIds.length] ?? null;
}

export function ensureDailyChallengeForDate<TQuestionId extends string>(
  snapshot: DailyChallengeSnapshot<TQuestionId>,
  input: {
    localDate: LocalDateString;
    eligibleQuestionIds: readonly TQuestionId[];
  },
): DailyChallengeSnapshot<TQuestionId> {
  const existingEntry = snapshot.history[input.localDate];
  const selectedQuestionId =
    existingEntry?.questionId ??
    selectDailyQuestionId(input.localDate, input.eligibleQuestionIds);

  if (selectedQuestionId === null) {
    return {
      ...snapshot,
      date: input.localDate,
      questionId: null,
      completed: false,
      correct: null,
    };
  }

  const entry: DailyChallengeHistoryEntry<TQuestionId> =
    existingEntry ?? {
      date: input.localDate,
      questionId: selectedQuestionId,
      completed: false,
      correct: null,
    };

  return {
    ...snapshot,
    date: input.localDate,
    questionId: entry.questionId,
    completed: entry.completed,
    correct: entry.correct,
    history: {
      ...snapshot.history,
      [input.localDate]: entry,
    },
  };
}

export function recordDailyChallengeResult<TQuestionId extends string>(
  snapshot: DailyChallengeSnapshot<TQuestionId>,
  input: {
    localDate: LocalDateString;
    questionId: TQuestionId;
    correct: boolean;
  },
): DailyChallengeSnapshot<TQuestionId> {
  const entry: DailyChallengeHistoryEntry<TQuestionId> = {
    date: input.localDate,
    questionId: input.questionId,
    completed: true,
    correct: input.correct,
  };

  return {
    ...snapshot,
    date: input.localDate,
    questionId: input.questionId,
    completed: true,
    correct: input.correct,
    history: {
      ...snapshot.history,
      [input.localDate]: entry,
    },
  };
}

export function getDailyHistoryWindow<TQuestionId extends string>(
  snapshot: DailyChallengeSnapshot<TQuestionId>,
  anchorDate: LocalDateString,
  days = 7,
): Array<DailyChallengeHistoryEntry<TQuestionId> | null> {
  return getPriorLocalDates(anchorDate, days)
    .reverse()
    .map((date) => snapshot.history[date] ?? null);
}

