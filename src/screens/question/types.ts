import type { LocalDateString } from "@/lib/dates";
import type { ModuleId } from "@/lib/modules";
import type { QuestionId } from "@/store";
import type { QuestionRewardContext } from "@/lib/xp";

export type TextMultipleChoiceQuestion = {
  id: QuestionId;
  moduleId: ModuleId;
  type: "multiple-choice-text";
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  tags: readonly string[];
  dailyEligible: boolean;
};

export type QuestionScreenContinuePayload = {
  questionId: QuestionId;
  isCorrect: boolean;
  awardedXp: number;
};

export type QuestionScreenProps = {
  question: TextMultipleChoiceQuestion;
  context: QuestionRewardContext;
  moduleId?: ModuleId | null;
  dailyDate?: LocalDateString | null;
  questionNumber?: number;
  totalQuestions?: number;
  moduleLabel?: string;
  continueLabel?: string;
  onContinue?: (payload: QuestionScreenContinuePayload) => void;
  onExit?: () => void;
};
