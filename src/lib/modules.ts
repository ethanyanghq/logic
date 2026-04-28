export const MODULE_IDS = [
  "foundations",
  "conditional-reasoning",
  "logical-fallacies",
  "visual-patterns",
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export const MODULE_SEQUENCE: readonly ModuleId[] = MODULE_IDS;

export const FOUNDATIONS_MODULE_ID: ModuleId = "foundations";
export const CONDITIONAL_REASONING_MODULE_ID: ModuleId =
  "conditional-reasoning";
export const LOGICAL_FALLACIES_MODULE_ID: ModuleId = "logical-fallacies";
export const VISUAL_PATTERNS_MODULE_ID: ModuleId = "visual-patterns";

