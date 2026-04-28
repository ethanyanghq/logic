export const QUESTION_XP = {
  correct: 10,
  incorrect: 2,
  dailyCorrect: 50,
  dailyIncorrect: 5,
  moduleCompletion: 25,
} as const;

export type QuestionRewardContext =
  | "module"
  | "daily"
  | "onboarding-sample"
  | "onboarding-diagnostic";

export type BaselineLevel = 1 | 2 | 3;

export function getQuestionXpAward(input: {
  isCorrect: boolean;
  context: QuestionRewardContext;
}): number {
  if (input.context === "daily") {
    return input.isCorrect ? QUESTION_XP.dailyCorrect : QUESTION_XP.dailyIncorrect;
  }

  return input.isCorrect ? QUESTION_XP.correct : QUESTION_XP.incorrect;
}

export function getModuleCompletionXpAward(): number {
  return QUESTION_XP.moduleCompletion;
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / 200) + 1;
}

export function addXp(currentXp: number, awardedXp: number): number {
  return Math.max(0, currentXp + Math.max(0, awardedXp));
}

