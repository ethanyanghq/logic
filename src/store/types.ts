import type {
  DailyChallengeSnapshot,
} from "@/lib/daily";
import type { LocalDateString } from "@/lib/dates";
import type { AvatarId, OnboardingStage, UserGoal } from "@/lib/onboarding";
import type { DemoPreferences } from "@/lib/preferences";
import type { ModuleId } from "@/lib/modules";
import type { BaselineLevel, QuestionRewardContext } from "@/lib/xp";

export type QuestionId = string;
export type BadgeId = string;

export type QuestionProgressDraft = {
  context: QuestionRewardContext;
  moduleId: ModuleId | null;
  dailyDate: LocalDateString | null;
  selectedOptionIndex: number | null;
  updatedAt: string;
};

export type AnsweredQuestionAttempt = {
  context: QuestionRewardContext;
  moduleId: ModuleId | null;
  localDate: LocalDateString;
  selectedOptionIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  answeredAt: string;
  awardedXp: number;
};

export type QuestionProgress = {
  draft: QuestionProgressDraft | null;
  moduleAttempt: AnsweredQuestionAttempt | null;
  onboardingSampleAttempt: AnsweredQuestionAttempt | null;
  onboardingDiagnosticAttempt: AnsweredQuestionAttempt | null;
  dailyAttempts: Record<LocalDateString, AnsweredQuestionAttempt>;
};

export type ModuleProgress = {
  answeredQuestionIds: QuestionId[];
  correctQuestionIds: QuestionId[];
  completed: boolean;
  completedAt: string | null;
};

export type UserProfile = {
  displayName: string | null;
  avatarId: AvatarId | null;
  selectedGoal: UserGoal | null;
  baselineLevel: BaselineLevel | null;
  recommendedModuleId: ModuleId | null;
  memberSinceDate: LocalDateString | null;
};

export type ProgressState = {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: LocalDateString | null;
  lastAnsweredAt: string | null;
  availableStreakFreezes: number;
  hasUnlockedStreakFreeze: boolean;
};

export type OnboardingState = {
  stage: OnboardingStage;
  welcomeCompleted: boolean;
  goalSelected: boolean;
  sampleQuestionId: QuestionId | null;
  sampleCompleted: boolean;
  diagnosticQuestionIds: QuestionId[];
  diagnosticCompletedCount: number;
  diagnosticCorrectCount: number;
  profileCompleted: boolean;
  homeRevealPending: boolean;
};

export type ActivityEvent =
  | {
      id: string;
      type: "question-answered";
      questionId: QuestionId;
      context: QuestionRewardContext;
      moduleId: ModuleId | null;
      localDate: LocalDateString;
      occurredAt: string;
      isCorrect: boolean;
      awardedXp: number;
    }
  | {
      id: string;
      type: "module-completed";
      moduleId: ModuleId;
      localDate: LocalDateString;
      occurredAt: string;
      awardedXp: number;
    };

export type PersistedAppStoreState = {
  profile: UserProfile;
  progress: ProgressState;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  questionProgress: Record<QuestionId, QuestionProgress>;
  earnedBadgeIds: BadgeId[];
  dailyChallenge: DailyChallengeSnapshot<QuestionId>;
  preferences: DemoPreferences;
  onboarding: OnboardingState;
  activityLog: ActivityEvent[];
};

export type AppStoreMetaState = {
  hasHydrated: boolean;
  lastAppliedPresetKey: string | null;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer TValue>
    ? TValue[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type AppStorePreset = {
  key: string;
  label: string;
  state: DeepPartial<PersistedAppStoreState>;
};

export type SetQuestionSelectionInput = {
  questionId: QuestionId;
  context: QuestionRewardContext;
  selectedOptionIndex: number | null;
  moduleId?: ModuleId | null;
  localDate?: LocalDateString | null;
  updatedAt?: Date | number | string;
};

export type SubmitQuestionAnswerInput = {
  questionId: QuestionId;
  context: QuestionRewardContext;
  selectedOptionIndex: number;
  correctIndex: number;
  moduleId?: ModuleId | null;
  localDate?: LocalDateString | null;
  answeredAt?: Date | number | string;
};

export type SubmitQuestionAnswerResult = {
  questionId: QuestionId;
  context: QuestionRewardContext;
  moduleId: ModuleId | null;
  localDate: LocalDateString;
  isCorrect: boolean;
  awardedXp: number;
  newXpTotal: number;
  newLevel: number;
  streak: {
    current: number;
    longest: number;
    milestoneReached: number | null;
    usedFreeze: boolean;
  };
};

export type CompleteModuleInput = {
  moduleId: ModuleId;
  completedAt?: Date | number | string;
  awardXp?: boolean;
};

export type CompleteModuleResult = {
  moduleId: ModuleId;
  awardedXp: number;
  newXpTotal: number;
  completedAt: string;
};

export type CompleteOnboardingProfileInput = {
  displayName: string;
  avatarId: AvatarId;
  completedAt?: Date | number | string;
};

export type AppStoreActions = {
  finishHydration: () => void;
  resetApp: () => void;
  applyPreset: (preset: AppStorePreset) => void;
  setQuestionSelection: (input: SetQuestionSelectionInput) => void;
  clearQuestionSelection: (
    questionId: QuestionId,
    context?: QuestionRewardContext,
  ) => void;
  submitQuestionAnswer: (
    input: SubmitQuestionAnswerInput,
  ) => SubmitQuestionAnswerResult;
  awardXp: (amount: number) => number;
  recomputeStreak: (referenceDate?: LocalDateString) => void;
  syncDailyChallenge: (
    eligibleQuestionIds: readonly QuestionId[],
    localDate?: LocalDateString,
  ) => QuestionId | null;
  updateDemoPreferences: (patch: Partial<DemoPreferences>) => void;
  completeWelcomeStep: () => void;
  setOnboardingStage: (stage: OnboardingStage) => void;
  setOnboardingGoal: (goal: UserGoal) => void;
  setOnboardingSampleQuestion: (questionId: QuestionId) => void;
  setOnboardingDiagnosticQuestionIds: (questionIds: readonly QuestionId[]) => void;
  completeOnboardingProfile: (
    input: CompleteOnboardingProfileInput,
  ) => {
    baselineLevel: BaselineLevel;
    recommendedModuleId: ModuleId;
  };
  markOnboardingHomeRevealSeen: () => void;
  completeModule: (input: CompleteModuleInput) => CompleteModuleResult | null;
};

export type AppStoreState = PersistedAppStoreState &
  AppStoreMetaState &
  AppStoreActions;
