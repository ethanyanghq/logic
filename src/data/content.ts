import {
  CONDITIONAL_REASONING_MODULE_ID,
  FOUNDATIONS_MODULE_ID,
  LOGICAL_FALLACIES_MODULE_ID,
  MODULE_SEQUENCE,
  VISUAL_PATTERNS_MODULE_ID,
  type ModuleId,
} from "../lib/modules.ts";
import type { QuestionId } from "../store/types.ts";

export const CONTENT_QUESTION_TYPES = ["multiple-choice-text"] as const;
export type ContentQuestionType = (typeof CONTENT_QUESTION_TYPES)[number];

export const MODULE_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export type ModuleDifficulty = (typeof MODULE_DIFFICULTIES)[number];

export type TextMultipleChoiceQuestionRecord = {
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

export type ModuleContentRecord = {
  id: ModuleId;
  title: string;
  subtitle: string;
  difficulty: ModuleDifficulty;
  conceptPrimer: string;
  isPlayable: boolean;
  questionIds: readonly QuestionId[];
};

export type ContentPack = {
  modules: readonly ModuleContentRecord[];
  questions: readonly TextMultipleChoiceQuestionRecord[];
};

export const FOUNDATIONS_QUESTION_IDS = [
  "foundations-q01",
  "foundations-q02",
  "foundations-q03",
  "foundations-q04",
  "foundations-q05",
] as const satisfies readonly QuestionId[];

export const QUESTIONS: readonly TextMultipleChoiceQuestionRecord[] = [
  {
    id: FOUNDATIONS_QUESTION_IDS[0],
    moduleId: FOUNDATIONS_MODULE_ID,
    type: "multiple-choice-text",
    difficulty: 1,
    prompt:
      "All mammals are warm-blooded. Whales are mammals. Which conclusion must be true?",
    options: [
      "Whales are warm-blooded.",
      "Some warm-blooded things are not mammals.",
      "All warm-blooded things are whales.",
      "Whales are the only mammals in the ocean.",
    ],
    correctIndex: 0,
    explanation:
      "A universal rule plus a matching example lets you carry the rule's property to that example.",
    tags: ["deduction", "syllogism"],
    dailyEligible: true,
  },
  {
    id: FOUNDATIONS_QUESTION_IDS[1],
    moduleId: FOUNDATIONS_MODULE_ID,
    type: "multiple-choice-text",
    difficulty: 2,
    prompt:
      "If a claim is logically impossible, then it cannot be true. A claim is true. What follows?",
    options: [
      "The claim is logically impossible.",
      "The claim may still be logically impossible.",
      "The claim is not logically impossible.",
      "The claim is both true and impossible.",
    ],
    correctIndex: 2,
    explanation:
      "This uses the contrapositive: if impossible implies not true, then true implies not impossible.",
    tags: ["conditional", "contrapositive"],
    dailyEligible: true,
  },
  {
    id: FOUNDATIONS_QUESTION_IDS[2],
    moduleId: FOUNDATIONS_MODULE_ID,
    type: "multiple-choice-text",
    difficulty: 1,
    prompt:
      "Either the library closes at 6 p.m. or it closes at 8 p.m. The library does not close at 6 p.m. Which conclusion is justified?",
    options: [
      "Nothing can be concluded.",
      "It closes sometime after 8 p.m.",
      "It closes at 8 p.m.",
      "It closes at both 6 p.m. and 8 p.m.",
    ],
    correctIndex: 2,
    explanation:
      "When one option in an either/or statement is ruled out, the remaining option must be the answer.",
    tags: ["disjunction", "elimination"],
    dailyEligible: true,
  },
  {
    id: FOUNDATIONS_QUESTION_IDS[3],
    moduleId: FOUNDATIONS_MODULE_ID,
    type: "multiple-choice-text",
    difficulty: 1,
    prompt:
      "No statements that contradict themselves can be true. 'It is raining here right now and it is not raining here right now' is self-contradictory. Which conclusion follows?",
    options: [
      "The statement might be true in unusual weather.",
      "The statement cannot be true.",
      "All weather reports are unreliable.",
      "Only some contradictions are false.",
    ],
    correctIndex: 1,
    explanation:
      "A contradiction asserts both a claim and its negation, so it cannot be true under the same conditions.",
    tags: ["contradiction", "consistency"],
    dailyEligible: false,
  },
  {
    id: FOUNDATIONS_QUESTION_IDS[4],
    moduleId: FOUNDATIONS_MODULE_ID,
    type: "multiple-choice-text",
    difficulty: 2,
    prompt:
      "A speaker says, 'Every student in the workshop finished the puzzle in under a minute.' Which new fact would be enough to disprove that claim?",
    options: [
      "One student finished in exactly 90 seconds.",
      "Most students finished quickly.",
      "The speaker sounded confident.",
      "Several students asked for hints before starting.",
    ],
    correctIndex: 0,
    explanation:
      "A universal claim is disproved by one counterexample that fails the stated rule.",
    tags: ["counterexample", "universal-claims"],
    dailyEligible: false,
  },
] as const;

export const MODULES: readonly ModuleContentRecord[] = [
  {
    id: FOUNDATIONS_MODULE_ID,
    title: "Foundations",
    subtitle: "Core deduction, contradiction, and counterexample habits.",
    difficulty: "Beginner",
    conceptPrimer:
      "Foundations trains the first moves of formal reasoning: track what a rule actually says, apply it only where it fits, and test broad claims with concrete cases.",
    isPlayable: true,
    questionIds: FOUNDATIONS_QUESTION_IDS,
  },
  {
    id: CONDITIONAL_REASONING_MODULE_ID,
    title: "Conditional Reasoning",
    subtitle: "If/then structure, necessary conditions, and inference traps.",
    difficulty: "Intermediate",
    conceptPrimer:
      "Conditional reasoning focuses on what follows from a premise, what does not, and how to avoid mixing up sufficient evidence with necessary conditions.",
    isPlayable: false,
    questionIds: [],
  },
  {
    id: LOGICAL_FALLACIES_MODULE_ID,
    title: "Logical Fallacies",
    subtitle: "Spot persuasive mistakes before they sound convincing.",
    difficulty: "Intermediate",
    conceptPrimer:
      "Logical fallacies sharpen pattern recognition for weak arguments by separating a claim's emotional force from whether its reasoning actually holds.",
    isPlayable: false,
    questionIds: [],
  },
  {
    id: VISUAL_PATTERNS_MODULE_ID,
    title: "Visual Patterns",
    subtitle: "Sequence and grid rules for shape-based reasoning.",
    difficulty: "Advanced",
    conceptPrimer:
      "Visual patterns asks learners to infer rules from changing shapes, positions, and symmetries without relying on verbal cues alone.",
    isPlayable: false,
    questionIds: [],
  },
] as const;

export const CONTENT_PACK = {
  modules: MODULES,
  questions: QUESTIONS,
} as const satisfies ContentPack;

export const MODULES_BY_ID = indexById(MODULES);
export const QUESTIONS_BY_ID = indexById(QUESTIONS);

export const PLAYABLE_MODULE_ID = FOUNDATIONS_MODULE_ID;
export const PLAYABLE_MODULE = MODULES_BY_ID[PLAYABLE_MODULE_ID];
export const PREVIEW_MODULES = MODULES.filter(
  (module) => !module.isPlayable,
) as readonly ModuleContentRecord[];
export const PLAYABLE_MODULE_QUESTIONS = getQuestionsForModule(
  PLAYABLE_MODULE_ID,
);

export function getModuleById(
  moduleId: ModuleId,
): ModuleContentRecord | null {
  return MODULES_BY_ID[moduleId] ?? null;
}

export function getQuestionById(
  questionId: QuestionId,
): TextMultipleChoiceQuestionRecord | null {
  return QUESTIONS_BY_ID[questionId] ?? null;
}

export function getQuestionsForModule(
  moduleId: ModuleId,
): readonly TextMultipleChoiceQuestionRecord[] {
  const module = MODULES_BY_ID[moduleId];
  if (!module) {
    return [];
  }

  return module.questionIds
    .map((questionId) => QUESTIONS_BY_ID[questionId] ?? null)
    .filter(
      (
        question,
      ): question is TextMultipleChoiceQuestionRecord => question !== null,
    );
}

export const MODULE_CONTENT_SEQUENCE = MODULE_SEQUENCE.map(
  (moduleId) => MODULES_BY_ID[moduleId],
).filter((module): module is ModuleContentRecord => module !== undefined);

function indexById<TKey extends string, TRecord extends { id: TKey }>(
  records: readonly TRecord[],
): Readonly<Record<TKey, TRecord>> {
  return records.reduce<Record<TKey, TRecord>>((accumulator, record) => {
    accumulator[record.id] = record;
    return accumulator;
  }, {} as Record<TKey, TRecord>);
}
