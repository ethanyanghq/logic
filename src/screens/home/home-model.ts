import {
  MODULES,
  PLAYABLE_MODULE_ID,
  PLAYABLE_MODULE_QUESTIONS,
  type ModuleContentRecord,
  type ModuleDifficulty,
} from "@/data/content";
import { type ModuleId } from "@/lib/modules";
import type { ModuleProgress, PersistedAppStoreState } from "@/store";

export type HomeStoreSnapshot = Pick<
  PersistedAppStoreState,
  "profile" | "progress" | "moduleProgress"
>;

export type HomeModuleCardModel = {
  id: ModuleId;
  title: string;
  subtitle: string;
  difficulty: ModuleDifficulty;
  isPlayable: boolean;
  isPreview: boolean;
  isRecommended: boolean;
  completed: boolean;
  progressValue: number;
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  badgeLabel: string;
  ctaLabel: string;
};

export type HomeScreenModel = {
  profileName: string | null;
  greetingLabel: string;
  dateLabel: string;
  xpValueLabel: string;
  levelValueLabel: string;
  xpCaption: string;
  levelCaption: string;
  heroBadgeLabel: string;
  heroBadgeTone: "solar" | "success" | "neural";
  heroTitle: string;
  heroDetail: string;
  heroCtaLabel: string;
  heroProgressLabel: string;
  heroProgressValue: number;
  playableModule: HomeModuleCardModel;
  previewModules: HomeModuleCardModel[];
};

type BuildHomeScreenModelInput = {
  snapshot: HomeStoreSnapshot;
  hasCompletedProfile: boolean;
  recommendedModuleId: ModuleId | null;
  xp: number;
  level: number;
  now?: Date | number | string;
};

const PLAYABLE_TOTAL_QUESTIONS = PLAYABLE_MODULE_QUESTIONS.length;

export function buildHomeScreenModel(
  input: BuildHomeScreenModelInput,
): HomeScreenModel {
  const now = input.now ?? new Date();
  const profileName = input.snapshot.profile.displayName?.trim() || null;

  const playableModule = buildModuleCardModel({
    record: getModuleRecord(PLAYABLE_MODULE_ID),
    progress: input.snapshot.moduleProgress[PLAYABLE_MODULE_ID],
    recommendedModuleId: input.recommendedModuleId,
  });

  const previewModules = MODULES.filter(
    (module) => module.id !== PLAYABLE_MODULE_ID,
  ).map((record) =>
    buildModuleCardModel({
      record,
      progress: input.snapshot.moduleProgress[record.id],
      recommendedModuleId: input.recommendedModuleId,
    }),
  );

  return {
    profileName,
    greetingLabel: buildGreetingLabel(now, input.hasCompletedProfile, profileName),
    dateLabel: formatLongDate(now),
    xpValueLabel: formatXpValue(input.xp),
    levelValueLabel: `L${input.level}`,
    xpCaption: input.xp === 0 ? "Earn XP with every answer" : "Total earned",
    levelCaption: input.snapshot.profile.baselineLevel !== null
      ? `Baseline L${input.snapshot.profile.baselineLevel}`
      : "Derived from total XP",
    heroBadgeLabel: buildHeroBadgeLabel(playableModule),
    heroBadgeTone: playableModule.completed
      ? "success"
      : playableModule.answeredCount > 0
        ? "neural"
        : "solar",
    heroTitle: buildHeroTitle(playableModule),
    heroDetail: buildHeroDetail(playableModule),
    heroCtaLabel: playableModule.completed
      ? "Review Foundations"
      : playableModule.answeredCount > 0
        ? "Resume Foundations"
        : "Start Foundations",
    heroProgressLabel: playableModule.completed
      ? `${playableModule.correctCount}/${playableModule.totalQuestions} correct`
      : `${playableModule.answeredCount}/${playableModule.totalQuestions} answered`,
    heroProgressValue: playableModule.progressValue,
    playableModule,
    previewModules,
  };
}

function buildModuleCardModel(input: {
  record: ModuleContentRecord;
  progress: ModuleProgress | undefined;
  recommendedModuleId: ModuleId | null;
}): HomeModuleCardModel {
  const { record, progress } = input;
  const isPlayable = record.isPlayable;
  const totalQuestions = isPlayable ? PLAYABLE_TOTAL_QUESTIONS : 0;
  const answeredCount = isPlayable
    ? Math.min(progress?.answeredQuestionIds.length ?? 0, totalQuestions)
    : 0;
  const correctCount = isPlayable
    ? Math.min(progress?.correctQuestionIds.length ?? 0, totalQuestions)
    : 0;
  const completed = isPlayable ? Boolean(progress?.completed) : false;
  const progressValue =
    isPlayable && totalQuestions > 0 ? answeredCount / totalQuestions : 0;
  const isRecommended =
    isPlayable && input.recommendedModuleId === record.id;

  if (!isPlayable) {
    return {
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      difficulty: record.difficulty,
      isPlayable: false,
      isPreview: true,
      isRecommended: false,
      completed: false,
      progressValue: 0,
      answeredCount: 0,
      totalQuestions: 0,
      correctCount: 0,
      badgeLabel: "Preview",
      ctaLabel: "Preview only",
    };
  }

  return {
    id: record.id,
    title: record.title,
    subtitle: record.subtitle,
    difficulty: record.difficulty,
    isPlayable: true,
    isPreview: false,
    isRecommended,
    completed,
    progressValue,
    answeredCount,
    totalQuestions,
    correctCount,
    badgeLabel: completed
      ? "Complete"
      : answeredCount > 0
        ? "In progress"
        : isRecommended
          ? "Recommended"
          : "Playable",
    ctaLabel: completed ? "Review" : answeredCount > 0 ? "Resume" : "Start",
  };
}

function buildHeroBadgeLabel(module: HomeModuleCardModel): string {
  if (module.completed) {
    return "Mastered run";
  }
  if (module.answeredCount > 0) {
    return "Resume path";
  }
  return "Recommended start";
}

function buildHeroTitle(module: HomeModuleCardModel): string {
  if (module.completed) {
    return "Foundations complete";
  }
  if (module.answeredCount > 0) {
    return "Continue Foundations";
  }
  return "Start Foundations";
}

function buildHeroDetail(module: HomeModuleCardModel): string {
  if (module.completed) {
    return "Your core module is done. Replay any question to refine the run.";
  }
  if (module.answeredCount > 0) {
    return `Pick up where you left off — ${module.totalQuestions - module.answeredCount} question${module.totalQuestions - module.answeredCount === 1 ? "" : "s"} remaining.`;
  }
  return `${module.totalQuestions} authored questions on deduction, contradiction, and counterexamples.`;
}

function buildGreetingLabel(
  now: Date | number | string,
  hasCompletedProfile: boolean,
  profileName: string | null,
): string {
  const date = now instanceof Date ? now : new Date(now);
  const hour = date.getHours();
  const prefix =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (hasCompletedProfile && profileName) {
    return `${prefix}, ${profileName}`;
  }

  return prefix;
}

function formatXpValue(xp: number): string {
  return new Intl.NumberFormat("en-US").format(xp);
}

function formatLongDate(now: Date | number | string): string {
  const date = now instanceof Date ? now : new Date(now);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getModuleRecord(moduleId: ModuleId): ModuleContentRecord {
  const record = MODULES.find((module) => module.id === moduleId);
  if (!record) {
    throw new Error(`Missing canonical module record for ${moduleId}`);
  }
  return record;
}
