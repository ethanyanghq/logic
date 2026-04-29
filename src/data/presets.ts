import type { ModuleId } from "../lib/modules.ts";
import { FOUNDATIONS_MODULE_ID } from "../lib/modules.ts";
import type { LocalDateString } from "../lib/dates.ts";
import { USER_GOALS, type AvatarId, type UserGoal } from "../lib/onboarding.ts";
import { QUESTION_XP } from "../lib/xp.ts";
import type {
  ActivityEvent,
  AnsweredQuestionAttempt,
  AppStorePreset,
  DeepPartial,
  ModuleProgress,
  PersistedAppStoreState,
  QuestionId,
  QuestionProgress,
} from "../store/types.ts";
import {
  FOUNDATIONS_QUESTION_IDS,
  PLAYABLE_MODULE_ID,
  QUESTIONS_BY_ID,
} from "./content.ts";

export const DEMO_PRESET_KEYS = [
  "fresh-user",
  "mid-foundations",
  "completion-ready",
  "power-user",
] as const;
export type DemoPresetKey = (typeof DEMO_PRESET_KEYS)[number];

export const DEMO_TARGET_SCREENS = [
  "onboarding",
  "home",
  "question",
  "completion",
] as const;
export type DemoTargetScreen = (typeof DEMO_TARGET_SCREENS)[number];

export type DemoPresetTarget =
  | {
      screen: "onboarding";
    }
  | {
      screen: "home";
    }
  | {
      screen: "question";
      moduleId: ModuleId;
      questionId: QuestionId;
    }
  | {
      screen: "completion";
      moduleId: ModuleId;
    };

export type DemoPresetBlueprint = {
  key: DemoPresetKey;
  label: string;
  description: string;
  target: DemoPresetTarget;
};

export type DemoPresetDefinition = AppStorePreset & DemoPresetBlueprint;

const MID_FOUNDATIONS_MEMBER_SINCE: LocalDateString = "2026-04-20";
const COMPLETION_READY_MEMBER_SINCE: LocalDateString = "2026-04-18";
const POWER_USER_MEMBER_SINCE: LocalDateString = "2026-04-12";

const MID_FOUNDATIONS_TIMESTAMPS = {
  q01: "2026-04-27T14:05:00.000Z",
  q02: "2026-04-28T09:12:00.000Z",
  q03Draft: "2026-04-28T09:16:00.000Z",
} as const;

const COMPLETION_READY_TIMESTAMPS = {
  q01: "2026-04-25T14:05:00.000Z",
  q02: "2026-04-26T14:08:00.000Z",
  q03: "2026-04-27T14:10:00.000Z",
  q04: "2026-04-28T08:40:00.000Z",
} as const;

const POWER_USER_TIMESTAMPS = {
  q01: "2026-04-20T13:05:00.000Z",
  q02: "2026-04-21T13:08:00.000Z",
  q03: "2026-04-22T13:10:00.000Z",
  q04: "2026-04-23T13:12:00.000Z",
  q05: "2026-04-24T13:15:00.000Z",
  moduleCompleted: "2026-04-24T13:20:00.000Z",
  dailyQ01A: "2026-04-25T12:00:00.000Z",
  dailyQ02: "2026-04-26T12:00:00.000Z",
  dailyQ03: "2026-04-27T12:00:00.000Z",
  dailyQ01B: "2026-04-28T12:00:00.000Z",
} as const;

const FRESH_USER_STATE = {
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
  moduleProgress: {
    [FOUNDATIONS_MODULE_ID]: createModuleProgress([], []),
  },
  questionProgress: {},
  dailyChallenge: {
    date: null,
    questionId: null,
    completed: false,
    correct: null,
    history: {},
  },
  activityLog: [],
} as const satisfies DeepPartial<PersistedAppStoreState>;

const MID_FOUNDATIONS_STATE = createMidFoundationsState();
const COMPLETION_READY_STATE = createCompletionReadyState();
const POWER_USER_STATE = createPowerUserState();

export const DEMO_PRESETS = [
  {
    key: "fresh-user",
    label: "Fresh user",
    description: "First-launch state before personalization is complete.",
    target: { screen: "onboarding" },
    state: FRESH_USER_STATE,
  },
  {
    key: "mid-foundations",
    label: "Mid-Foundations",
    description:
      "Foundations in progress with unanswered questions still remaining.",
    target: {
      screen: "question",
      moduleId: PLAYABLE_MODULE_ID,
      questionId: FOUNDATIONS_QUESTION_IDS[2],
    },
    state: MID_FOUNDATIONS_STATE,
  },
  {
    key: "completion-ready",
    label: "Completion ready",
    description:
      "Launch directly into the final Foundations question before completion.",
    target: {
      screen: "question",
      moduleId: PLAYABLE_MODULE_ID,
      questionId: FOUNDATIONS_QUESTION_IDS[4],
    },
    state: COMPLETION_READY_STATE,
  },
  {
    key: "power-user",
    label: "Power user",
    description:
      "Home-ready state with visible accumulated progress after Foundations.",
    target: { screen: "home" },
    state: POWER_USER_STATE,
  },
] as const satisfies readonly DemoPresetDefinition[];

export const DEMO_PRESET_BLUEPRINTS = DEMO_PRESETS.map(
  ({ key, label, description, target }) => ({
    key,
    label,
    description,
    target,
  }),
) as readonly DemoPresetBlueprint[];

export const DEMO_PRESETS_BY_KEY = DEMO_PRESETS.reduce<
  Readonly<Record<DemoPresetKey, DemoPresetDefinition>>
>((accumulator, preset) => {
  return {
    ...accumulator,
    [preset.key]: preset,
  };
}, {} as Record<DemoPresetKey, DemoPresetDefinition>);

export const DEMO_PRESET_BLUEPRINTS_BY_KEY = DEMO_PRESET_BLUEPRINTS.reduce<
  Readonly<Record<DemoPresetKey, DemoPresetBlueprint>>
>((accumulator, preset) => {
  return {
    ...accumulator,
    [preset.key]: preset,
  };
}, {} as Record<DemoPresetKey, DemoPresetBlueprint>);

export const DEFAULT_PLAYABLE_MODULE_TARGET = {
  screen: "question",
  moduleId: PLAYABLE_MODULE_ID,
  questionId: FOUNDATIONS_QUESTION_IDS[0],
} as const satisfies DemoPresetTarget;

export function getDemoPresetByKey(
  presetKey: DemoPresetKey,
): DemoPresetDefinition {
  return DEMO_PRESETS_BY_KEY[presetKey];
}

export function getDemoPresetBlueprintByKey(
  presetKey: DemoPresetKey,
): DemoPresetBlueprint {
  return DEMO_PRESET_BLUEPRINTS_BY_KEY[presetKey];
}

function createMidFoundationsState(): DeepPartial<PersistedAppStoreState> {
  const q01 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[0],
    "2026-04-27",
    MID_FOUNDATIONS_TIMESTAMPS.q01,
    true,
  );
  const q02 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[1],
    "2026-04-28",
    MID_FOUNDATIONS_TIMESTAMPS.q02,
    false,
  );

  return {
    profile: createCompletedProfile({
      displayName: "Maya",
      avatarId: "orbit",
      selectedGoal: USER_GOALS[0],
      memberSinceDate: MID_FOUNDATIONS_MEMBER_SINCE,
      baselineLevel: 1,
    }),
    progress: {
      xp: q01.awardedXp + q02.awardedXp,
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: "2026-04-28",
      lastAnsweredAt: MID_FOUNDATIONS_TIMESTAMPS.q02,
      availableStreakFreezes: 0,
      hasUnlockedStreakFreeze: false,
    },
    onboarding: createCompletedOnboarding(),
    moduleProgress: {
      [FOUNDATIONS_MODULE_ID]: createModuleProgress(
        [FOUNDATIONS_QUESTION_IDS[0], FOUNDATIONS_QUESTION_IDS[1]],
        [FOUNDATIONS_QUESTION_IDS[0]],
      ),
    },
    questionProgress: {
      [FOUNDATIONS_QUESTION_IDS[0]]: createQuestionProgressWithModuleAttempt(q01),
      [FOUNDATIONS_QUESTION_IDS[1]]: createQuestionProgressWithModuleAttempt(q02),
      [FOUNDATIONS_QUESTION_IDS[2]]: createQuestionProgressWithDraft(
        0,
        MID_FOUNDATIONS_TIMESTAMPS.q03Draft,
      ),
    },
    activityLog: [
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[0],
        q01,
        MID_FOUNDATIONS_TIMESTAMPS.q01,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[1],
        q02,
        MID_FOUNDATIONS_TIMESTAMPS.q02,
      ),
    ],
  };
}

function createCompletionReadyState(): DeepPartial<PersistedAppStoreState> {
  const q01 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[0],
    "2026-04-25",
    COMPLETION_READY_TIMESTAMPS.q01,
    true,
  );
  const q02 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[1],
    "2026-04-26",
    COMPLETION_READY_TIMESTAMPS.q02,
    true,
  );
  const q03 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[2],
    "2026-04-27",
    COMPLETION_READY_TIMESTAMPS.q03,
    false,
  );
  const q04 = createModuleAttempt(
    FOUNDATIONS_QUESTION_IDS[3],
    "2026-04-28",
    COMPLETION_READY_TIMESTAMPS.q04,
    true,
  );

  return {
    profile: createCompletedProfile({
      displayName: "Jordan",
      avatarId: "prism",
      selectedGoal: USER_GOALS[3],
      memberSinceDate: COMPLETION_READY_MEMBER_SINCE,
      baselineLevel: 1,
    }),
    progress: {
      xp: q01.awardedXp + q02.awardedXp + q03.awardedXp + q04.awardedXp,
      currentStreak: 4,
      longestStreak: 4,
      lastActiveDate: "2026-04-28",
      lastAnsweredAt: COMPLETION_READY_TIMESTAMPS.q04,
      availableStreakFreezes: 0,
      hasUnlockedStreakFreeze: false,
    },
    onboarding: createCompletedOnboarding(),
    moduleProgress: {
      [FOUNDATIONS_MODULE_ID]: createModuleProgress(
        [
          FOUNDATIONS_QUESTION_IDS[0],
          FOUNDATIONS_QUESTION_IDS[1],
          FOUNDATIONS_QUESTION_IDS[2],
          FOUNDATIONS_QUESTION_IDS[3],
        ],
        [
          FOUNDATIONS_QUESTION_IDS[0],
          FOUNDATIONS_QUESTION_IDS[1],
          FOUNDATIONS_QUESTION_IDS[3],
        ],
      ),
    },
    questionProgress: {
      [FOUNDATIONS_QUESTION_IDS[0]]: createQuestionProgressWithModuleAttempt(q01),
      [FOUNDATIONS_QUESTION_IDS[1]]: createQuestionProgressWithModuleAttempt(q02),
      [FOUNDATIONS_QUESTION_IDS[2]]: createQuestionProgressWithModuleAttempt(q03),
      [FOUNDATIONS_QUESTION_IDS[3]]: createQuestionProgressWithModuleAttempt(q04),
    },
    activityLog: [
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[0],
        q01,
        COMPLETION_READY_TIMESTAMPS.q01,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[1],
        q02,
        COMPLETION_READY_TIMESTAMPS.q02,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[2],
        q03,
        COMPLETION_READY_TIMESTAMPS.q03,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[3],
        q04,
        COMPLETION_READY_TIMESTAMPS.q04,
      ),
    ],
  };
}

function createPowerUserState(): DeepPartial<PersistedAppStoreState> {
  const moduleAttempts = [
    createModuleAttempt(
      FOUNDATIONS_QUESTION_IDS[0],
      "2026-04-20",
      POWER_USER_TIMESTAMPS.q01,
      true,
    ),
    createModuleAttempt(
      FOUNDATIONS_QUESTION_IDS[1],
      "2026-04-21",
      POWER_USER_TIMESTAMPS.q02,
      true,
    ),
    createModuleAttempt(
      FOUNDATIONS_QUESTION_IDS[2],
      "2026-04-22",
      POWER_USER_TIMESTAMPS.q03,
      true,
    ),
    createModuleAttempt(
      FOUNDATIONS_QUESTION_IDS[3],
      "2026-04-23",
      POWER_USER_TIMESTAMPS.q04,
      true,
    ),
    createModuleAttempt(
      FOUNDATIONS_QUESTION_IDS[4],
      "2026-04-24",
      POWER_USER_TIMESTAMPS.q05,
      true,
    ),
  ] as const;
  const dailyAttempts = [
    createDailyAttempt(
      FOUNDATIONS_QUESTION_IDS[0],
      "2026-04-25",
      POWER_USER_TIMESTAMPS.dailyQ01A,
      true,
    ),
    createDailyAttempt(
      FOUNDATIONS_QUESTION_IDS[1],
      "2026-04-26",
      POWER_USER_TIMESTAMPS.dailyQ02,
      true,
    ),
    createDailyAttempt(
      FOUNDATIONS_QUESTION_IDS[2],
      "2026-04-27",
      POWER_USER_TIMESTAMPS.dailyQ03,
      true,
    ),
    createDailyAttempt(
      FOUNDATIONS_QUESTION_IDS[0],
      "2026-04-28",
      POWER_USER_TIMESTAMPS.dailyQ01B,
      true,
    ),
  ] as const;

  const moduleXp = moduleAttempts.reduce(
    (total, attempt) => total + attempt.awardedXp,
    0,
  );
  const dailyXp = dailyAttempts.reduce(
    (total, attempt) => total + attempt.awardedXp,
    0,
  );

  return {
    profile: createCompletedProfile({
      displayName: "Avery",
      avatarId: "wave",
      selectedGoal: USER_GOALS[1],
      memberSinceDate: POWER_USER_MEMBER_SINCE,
      baselineLevel: 2,
    }),
    progress: {
      xp: moduleXp + QUESTION_XP.moduleCompletion + dailyXp,
      currentStreak: 9,
      longestStreak: 9,
      lastActiveDate: "2026-04-28",
      lastAnsweredAt: POWER_USER_TIMESTAMPS.dailyQ01B,
      availableStreakFreezes: 1,
      hasUnlockedStreakFreeze: true,
    },
    onboarding: createCompletedOnboarding(),
    moduleProgress: {
      [FOUNDATIONS_MODULE_ID]: createModuleProgress(
        [...FOUNDATIONS_QUESTION_IDS],
        [...FOUNDATIONS_QUESTION_IDS],
        POWER_USER_TIMESTAMPS.moduleCompleted,
      ),
    },
    questionProgress: {
      [FOUNDATIONS_QUESTION_IDS[0]]: createQuestionProgress({
        moduleAttempt: moduleAttempts[0],
        dailyAttempts: {
          "2026-04-25": dailyAttempts[0],
          "2026-04-28": dailyAttempts[3],
        },
      }),
      [FOUNDATIONS_QUESTION_IDS[1]]: createQuestionProgress({
        moduleAttempt: moduleAttempts[1],
        dailyAttempts: {
          "2026-04-26": dailyAttempts[1],
        },
      }),
      [FOUNDATIONS_QUESTION_IDS[2]]: createQuestionProgress({
        moduleAttempt: moduleAttempts[2],
        dailyAttempts: {
          "2026-04-27": dailyAttempts[2],
        },
      }),
      [FOUNDATIONS_QUESTION_IDS[3]]: createQuestionProgress({
        moduleAttempt: moduleAttempts[3],
      }),
      [FOUNDATIONS_QUESTION_IDS[4]]: createQuestionProgress({
        moduleAttempt: moduleAttempts[4],
      }),
    },
    dailyChallenge: {
      date: "2026-04-28",
      questionId: FOUNDATIONS_QUESTION_IDS[0],
      completed: true,
      correct: true,
      history: {
        "2026-04-25": createDailyHistoryEntry(
          "2026-04-25",
          FOUNDATIONS_QUESTION_IDS[0],
          true,
        ),
        "2026-04-26": createDailyHistoryEntry(
          "2026-04-26",
          FOUNDATIONS_QUESTION_IDS[1],
          true,
        ),
        "2026-04-27": createDailyHistoryEntry(
          "2026-04-27",
          FOUNDATIONS_QUESTION_IDS[2],
          true,
        ),
        "2026-04-28": createDailyHistoryEntry(
          "2026-04-28",
          FOUNDATIONS_QUESTION_IDS[0],
          true,
        ),
      },
    },
    activityLog: [
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[0],
        moduleAttempts[0],
        POWER_USER_TIMESTAMPS.q01,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[1],
        moduleAttempts[1],
        POWER_USER_TIMESTAMPS.q02,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[2],
        moduleAttempts[2],
        POWER_USER_TIMESTAMPS.q03,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[3],
        moduleAttempts[3],
        POWER_USER_TIMESTAMPS.q04,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[4],
        moduleAttempts[4],
        POWER_USER_TIMESTAMPS.q05,
      ),
      createModuleCompletedActivityEvent(POWER_USER_TIMESTAMPS.moduleCompleted),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[0],
        dailyAttempts[0],
        POWER_USER_TIMESTAMPS.dailyQ01A,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[1],
        dailyAttempts[1],
        POWER_USER_TIMESTAMPS.dailyQ02,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[2],
        dailyAttempts[2],
        POWER_USER_TIMESTAMPS.dailyQ03,
      ),
      createQuestionAnsweredActivityEvent(
        FOUNDATIONS_QUESTION_IDS[0],
        dailyAttempts[3],
        POWER_USER_TIMESTAMPS.dailyQ01B,
      ),
    ],
  };
}

function createCompletedProfile(input: {
  displayName: string;
  avatarId: AvatarId;
  selectedGoal: UserGoal;
  memberSinceDate: LocalDateString;
  baselineLevel: 1 | 2 | 3;
}): DeepPartial<PersistedAppStoreState["profile"]> {
  return {
    displayName: input.displayName,
    avatarId: input.avatarId,
    selectedGoal: input.selectedGoal,
    baselineLevel: input.baselineLevel,
    recommendedModuleId: FOUNDATIONS_MODULE_ID,
    memberSinceDate: input.memberSinceDate,
  };
}

function createCompletedOnboarding(): DeepPartial<PersistedAppStoreState["onboarding"]> {
  return {
    stage: "complete",
    welcomeCompleted: true,
    goalSelected: true,
    sampleQuestionId: null,
    sampleCompleted: false,
    diagnosticQuestionIds: [],
    diagnosticCompletedCount: 0,
    diagnosticCorrectCount: 0,
    profileCompleted: true,
    homeRevealPending: false,
  };
}

function createModuleProgress(
  answeredQuestionIds: readonly QuestionId[],
  correctQuestionIds: readonly QuestionId[],
  completedAt: string | null = null,
): ModuleProgress {
  return {
    answeredQuestionIds: [...answeredQuestionIds],
    correctQuestionIds: [...correctQuestionIds],
    completed: completedAt !== null,
    completedAt,
  };
}

function createQuestionProgressWithModuleAttempt(
  moduleAttempt: AnsweredQuestionAttempt,
): QuestionProgress {
  return createQuestionProgress({ moduleAttempt });
}

function createQuestionProgressWithDraft(
  selectedOptionIndex: number,
  updatedAt: string,
): QuestionProgress {
  return createQuestionProgress({
    draft: {
      context: "module",
      moduleId: FOUNDATIONS_MODULE_ID,
      dailyDate: null,
      selectedOptionIndex,
      updatedAt,
    },
  });
}

function createQuestionProgress(input: {
  draft?: QuestionProgress["draft"];
  moduleAttempt?: AnsweredQuestionAttempt;
  dailyAttempts?: QuestionProgress["dailyAttempts"];
}): QuestionProgress {
  return {
    draft: input.draft ?? null,
    moduleAttempt: input.moduleAttempt ?? null,
    onboardingSampleAttempt: null,
    onboardingDiagnosticAttempt: null,
    dailyAttempts: input.dailyAttempts ?? {},
  };
}

function createModuleAttempt(
  questionId: QuestionId,
  localDate: LocalDateString,
  answeredAt: string,
  isCorrect: boolean,
): AnsweredQuestionAttempt {
  const selectedOptionIndex = isCorrect
    ? getCorrectOptionIndex(questionId)
    : getIncorrectOptionIndex(questionId);

  return {
    context: "module",
    moduleId: FOUNDATIONS_MODULE_ID,
    localDate,
    selectedOptionIndex,
    correctIndex: getCorrectOptionIndex(questionId),
    isCorrect,
    answeredAt,
    awardedXp: isCorrect ? QUESTION_XP.correct : QUESTION_XP.incorrect,
  };
}

function createDailyAttempt(
  questionId: QuestionId,
  localDate: LocalDateString,
  answeredAt: string,
  isCorrect: boolean,
): AnsweredQuestionAttempt {
  const selectedOptionIndex = isCorrect
    ? getCorrectOptionIndex(questionId)
    : getIncorrectOptionIndex(questionId);

  return {
    context: "daily",
    moduleId: null,
    localDate,
    selectedOptionIndex,
    correctIndex: getCorrectOptionIndex(questionId),
    isCorrect,
    answeredAt,
    awardedXp: isCorrect ? QUESTION_XP.dailyCorrect : QUESTION_XP.dailyIncorrect,
  };
}

function createQuestionAnsweredActivityEvent(
  questionId: QuestionId,
  attempt: AnsweredQuestionAttempt,
  occurredAt: string,
): ActivityEvent {
  return {
    id: `question-answered:${questionId}:${occurredAt}`,
    type: "question-answered",
    questionId,
    context: attempt.context,
    moduleId: attempt.moduleId,
    localDate: attempt.localDate,
    occurredAt,
    isCorrect: attempt.isCorrect,
    awardedXp: attempt.awardedXp,
  };
}

function createModuleCompletedActivityEvent(occurredAt: string): ActivityEvent {
  return {
    id: `module-completed:${FOUNDATIONS_MODULE_ID}:${occurredAt}`,
    type: "module-completed",
    moduleId: FOUNDATIONS_MODULE_ID,
    localDate: occurredAt.slice(0, 10) as LocalDateString,
    occurredAt,
    awardedXp: QUESTION_XP.moduleCompletion,
  };
}

function createDailyHistoryEntry(
  date: LocalDateString,
  questionId: QuestionId,
  correct: boolean,
) {
  return {
    date,
    questionId,
    completed: true,
    correct,
  };
}

function getCorrectOptionIndex(questionId: QuestionId): 0 | 1 | 2 | 3 {
  return QUESTIONS_BY_ID[questionId].correctIndex;
}

function getIncorrectOptionIndex(questionId: QuestionId): 0 | 1 | 2 | 3 {
  const correctIndex = getCorrectOptionIndex(questionId);
  return correctIndex === 0 ? 1 : 0;
}
