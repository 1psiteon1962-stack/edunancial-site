export const LEARNING_GOALS = [
  "manage-money","financial-stability","buy-home","real-estate-investing","start-business",
  "grow-business","taxes","contracts-legal-risk","investing","long-term-wealth","sales-marketing","leadership",
] as const;

export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const LEARNING_GOAL_PATHS: Record<LearningGoal, string[]> = {
  "manage-money": ["GREEN","WHITE"], "financial-stability": ["GREEN","WHITE"],
  "buy-home": ["GREEN","WHITE","RED","PURPLE"], "real-estate-investing": ["GREEN","WHITE","RED","PURPLE","GOLD"],
  "start-business": ["GREEN","WHITE","BLUE","PURPLE","ORANGE"], "grow-business": ["BLUE","ORANGE","BLACK","GOLD"],
  taxes: ["GREEN","BLUE"], "contracts-legal-risk": ["PURPLE","BLUE"], investing: ["WHITE","GOLD"],
  "long-term-wealth": ["GREEN","WHITE","GOLD"], "sales-marketing": ["ORANGE","BLUE"], leadership: ["BLACK","BLUE"],
};

export function normalizeLearningGoals(value: unknown): LearningGoal[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is LearningGoal =>
    typeof item === "string" && (LEARNING_GOALS as readonly string[]).includes(item),
  ))).slice(0, 6);
}
