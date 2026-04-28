import { FOUNDATIONS_MODULE_ID, type ModuleId } from "./modules";
import type { BaselineLevel } from "./xp";

export const USER_GOALS = [
  "lsat",
  "gre",
  "job-interviews",
  "general-reasoning",
  "just-curious",
] as const;

export const AVATAR_IDS = [
  "prism",
  "ring",
  "hex",
  "orbit",
  "grid",
  "wave",
] as const;

export type UserGoal = (typeof USER_GOALS)[number];
export type AvatarId = (typeof AVATAR_IDS)[number];

export type OnboardingStage =
  | "welcome"
  | "goal"
  | "sample"
  | "diagnostic"
  | "profile"
  | "complete";

export function getBaselineLevelFromDiagnosticScore(
  correctAnswers: number,
): BaselineLevel {
  if (correctAnswers >= 5) {
    return 3;
  }

  if (correctAnswers >= 3) {
    return 2;
  }

  return 1;
}

export function getRecommendedStartingModule(
  _baselineLevel: BaselineLevel,
): ModuleId {
  return FOUNDATIONS_MODULE_ID;
}
