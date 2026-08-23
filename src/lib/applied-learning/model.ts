export const APPLIED_LEARNING_TRACKS = [
  "RED",
  "WHITE",
  "BLUE",
  "GREEN",
  "GOLD",
  "PURPLE",
  "ORANGE",
  "BLACK",
] as const;

export type AppliedLearningTrack = (typeof APPLIED_LEARNING_TRACKS)[number];
export type AppliedLearningLevel = 1 | 2 | 3 | 4 | 5;

export type AppliedLearningStage =
  | "understand"
  | "apply"
  | "analyze"
  | "strategize"
  | "integrate";

export const APPLIED_LEARNING_STAGE_BY_LEVEL: Record<AppliedLearningLevel, AppliedLearningStage> = {
  1: "understand",
  2: "apply",
  3: "analyze",
  4: "strategize",
  5: "integrate",
};

export const MINIMUM_CROSS_TRACKS_BY_LEVEL: Record<AppliedLearningLevel, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 6,
};

export interface AppliedLearningChoiceFeedback {
  choiceId: string;
  feedback: string;
  consequence?: string;
  remediation?: string;
  nextStep?: string;
}

export interface AppliedLearningChoice {
  id: string;
  text: string;
  feedback?: AppliedLearningChoiceFeedback;
}

export interface AppliedLearningScenario {
  id: string;
  title: string;
  level: AppliedLearningLevel;
  primaryTrack: AppliedLearningTrack;
  supportingTracks: AppliedLearningTrack[];
  competencyTags: string[];
  prompt: string;
  evidence?: string[];
  numbers?: Record<string, number | string>;
  missingInformation?: string[];
  choices?: AppliedLearningChoice[];
  reflectionQuestions?: string[];
  aiCoachPrompts?: string[];
}

export interface AppliedLearningLessonExtension {
  lessonId: string;
  level: AppliedLearningLevel;
  stage: AppliedLearningStage;
  primaryTrack: AppliedLearningTrack;
  competencyTags: string[];
  scenarios?: AppliedLearningScenario[];
}

export function appliedLearningStage(level: AppliedLearningLevel): AppliedLearningStage {
  return APPLIED_LEARNING_STAGE_BY_LEVEL[level];
}

export function shouldUseAppliedLearningExtension(level: AppliedLearningLevel): boolean {
  // Level 1 remains fully compatible with the current simple lesson renderer.
  // Levels 2-5 may opt into richer scenario/decision/remediation structures.
  return level >= 2;
}

export function validateScenarioTrackDepth(scenario: AppliedLearningScenario): string[] {
  const distinctTracks = new Set<AppliedLearningTrack>([
    scenario.primaryTrack,
    ...scenario.supportingTracks,
  ]);
  const minimum = MINIMUM_CROSS_TRACKS_BY_LEVEL[scenario.level];

  if (distinctTracks.size < minimum) {
    return [
      `Level ${scenario.level} scenario ${scenario.id} uses ${distinctTracks.size} distinct track(s); expected at least ${minimum}.`,
    ];
  }

  return [];
}
