import type {
  AchievementDefinition,
  AchievementRule,
  UserProgress,
} from "./types";

// ─── Achievement Definitions ─────────────────────────────────────────────────
//
// To add a new achievement:
//   1. Add an entry to ACHIEVEMENT_DEFINITIONS below.
//   2. Define one or more AchievementRules with a `type` that matches a key in
//      RULE_EVALUATORS (add a new evaluator if needed).
//   That's it — the engine handles the rest automatically.
//
// ─────────────────────────────────────────────────────────────────────────────

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: "first_login",
    title: "First Login",
    description: "Welcome to Edunancial! You've taken the first step toward financial mastery.",
    icon: "🚀",
    category: "onboarding",
    tier: "bronze",
    points: 10,
    rules: [{ type: "min_logins", threshold: 1 }],
  },
  {
    id: "first_course_started",
    title: "First Course Started",
    description: "You've started your first course. The journey to financial competency begins!",
    icon: "📖",
    category: "onboarding",
    tier: "bronze",
    points: 25,
    rules: [{ type: "min_courses_started", threshold: 1 }],
  },
  {
    id: "first_course_completed",
    title: "First Course Completed",
    description: "You've completed your first course. Financial knowledge is building up!",
    icon: "🎓",
    category: "learning",
    tier: "silver",
    points: 100,
    rules: [{ type: "min_courses_completed", threshold: 1 }],
  },
  {
    id: "budget_builder",
    title: "Budget Builder",
    description: "Mastered budgeting fundamentals. You're building your financial foundation.",
    icon: "💰",
    category: "finance",
    tier: "silver",
    points: 150,
    rules: [{ type: "min_category_progress", threshold: 1 }, { type: "category_slug_budgeting", threshold: 1 }],
  },
  {
    id: "credit_champion",
    title: "Credit Champion",
    description: "You've unlocked the secrets of credit scores and management.",
    icon: "💳",
    category: "finance",
    tier: "silver",
    points: 150,
    rules: [{ type: "min_category_progress", threshold: 1 }, { type: "category_slug_credit", threshold: 1 }],
  },
  {
    id: "investing_explorer",
    title: "Investing Explorer",
    description: "You've begun exploring the world of investments and paper assets.",
    icon: "📈",
    category: "finance",
    tier: "silver",
    points: 150,
    rules: [{ type: "min_category_progress", threshold: 1 }, { type: "category_slug_investing", threshold: 1 }],
  },
  {
    id: "retirement_planner",
    title: "Retirement Planner",
    description: "You've taken steps toward securing your financial future in retirement.",
    icon: "🏖️",
    category: "finance",
    tier: "gold",
    points: 200,
    rules: [{ type: "min_category_progress", threshold: 1 }, { type: "category_slug_retirement", threshold: 1 }],
  },
  {
    id: "debt_destroyer",
    title: "Debt Destroyer",
    description: "You've learned powerful strategies to eliminate debt and build wealth.",
    icon: "⚡",
    category: "finance",
    tier: "gold",
    points: 200,
    rules: [{ type: "min_category_progress", threshold: 1 }, { type: "category_slug_debt", threshold: 1 }],
  },
  {
    id: "financial_literacy_master",
    title: "Financial Literacy Master",
    description: "You've demonstrated comprehensive financial knowledge across all domains.",
    icon: "🏆",
    category: "mastery",
    tier: "platinum",
    points: 500,
    rules: [{ type: "min_courses_completed", threshold: 10 }],
  },
  {
    id: "streak_7_day",
    title: "7-Day Learning Streak",
    description: "7 consecutive days of learning! Consistency is the key to mastery.",
    icon: "🔥",
    category: "streaks",
    tier: "silver",
    points: 75,
    rules: [{ type: "min_streak_days", threshold: 7 }],
  },
  {
    id: "streak_30_day",
    title: "30-Day Learning Streak",
    description: "30 days of continuous learning! You're building an unstoppable habit.",
    icon: "🌟",
    category: "streaks",
    tier: "gold",
    points: 300,
    rules: [{ type: "min_streak_days", threshold: 30 }],
  },
  {
    id: "lessons_100",
    title: "100 Lessons Completed",
    description: "You've completed 100 lessons. Your financial knowledge is growing rapidly!",
    icon: "💯",
    category: "mastery",
    tier: "gold",
    points: 250,
    rules: [{ type: "min_lessons_completed", threshold: 100 }],
  },
];

// ─── Rule Evaluators ──────────────────────────────────────────────────────────
//
// Map from rule `type` → evaluation function.
// Each function receives the rule and the user's progress snapshot and returns
// a boolean (earned) and an optional numeric progress (0–100).
//
// Adding a new rule type: add a key here; no changes to the engine needed.

type RuleEvaluatorResult = { earned: boolean; progress: number };
type RuleEvaluator = (rule: AchievementRule, progress: UserProgress) => RuleEvaluatorResult;

export const RULE_EVALUATORS: Record<string, RuleEvaluator> = {
  min_logins: (rule, progress) => ({
    earned: progress.totalLogins >= rule.threshold,
    progress: Math.min(100, (progress.totalLogins / rule.threshold) * 100),
  }),
  min_courses_started: (rule, progress) => ({
    earned: progress.coursesStarted >= rule.threshold,
    progress: Math.min(100, (progress.coursesStarted / rule.threshold) * 100),
  }),
  min_courses_completed: (rule, progress) => ({
    earned: progress.coursesCompleted >= rule.threshold,
    progress: Math.min(100, (progress.coursesCompleted / rule.threshold) * 100),
  }),
  min_lessons_completed: (rule, progress) => ({
    earned: progress.lessonsCompleted >= rule.threshold,
    progress: Math.min(100, (progress.lessonsCompleted / rule.threshold) * 100),
  }),
  min_streak_days: (rule, progress) => ({
    earned: progress.longestStreak >= rule.threshold,
    progress: Math.min(100, (progress.longestStreak / rule.threshold) * 100),
  }),
  /** Satisfied when the user has any category progress (used with category_slug_* rules). */
  min_category_progress: (_rule, progress) => ({
    earned: Object.keys(progress.categoryProgress).length > 0,
    progress: Object.keys(progress.categoryProgress).length > 0 ? 100 : 0,
  }),
  category_slug_budgeting: (_rule, progress) => {
    const count = progress.categoryProgress["budgeting"] ?? 0;
    return { earned: count >= 1, progress: count >= 1 ? 100 : 0 };
  },
  category_slug_credit: (_rule, progress) => {
    const count = progress.categoryProgress["credit"] ?? 0;
    return { earned: count >= 1, progress: count >= 1 ? 100 : 0 };
  },
  category_slug_investing: (_rule, progress) => {
    const count = progress.categoryProgress["investing"] ?? 0;
    return { earned: count >= 1, progress: count >= 1 ? 100 : 0 };
  },
  category_slug_retirement: (_rule, progress) => {
    const count = progress.categoryProgress["retirement"] ?? 0;
    return { earned: count >= 1, progress: count >= 1 ? 100 : 0 };
  },
  category_slug_debt: (_rule, progress) => {
    const count = progress.categoryProgress["debt"] ?? 0;
    return { earned: count >= 1, progress: count >= 1 ? 100 : 0 };
  },
};
