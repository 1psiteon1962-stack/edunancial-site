// ─── AI Context Engine ────────────────────────────────────────────────────────
// Builds a rich member context payload for the AI Tutor from available data.

import type {
  MemberContext,
  MemberProfile,
  LearningProgress,
  FinancialToolUsage,
} from "./types";

// Placeholder: in production, fetch from Supabase / API
export function buildMemberContext(userId?: string): MemberContext {
  const profile: MemberProfile = {
    userId: userId ?? "guest",
    displayName: userId ? "Member" : "Guest Learner",
    membershipLevel: "pro",
    learningGoals: ["budgeting", "investing", "wealth_building"],
    preferredLanguage: "en",
  };

  const learningProgress: LearningProgress = {
    completedCourseIds: [
      "budgeting-101",
      "emergency-fund",
      "debt-elimination",
    ],
    inProgressCourses: [
      {
        courseId: "investing-fundamentals",
        courseTitle: "Investing Fundamentals",
        completedLessons: 4,
        totalLessons: 12,
        percentComplete: 33,
        lastAccessedAt: new Date().toISOString(),
      },
    ],
    totalHoursLearned: 14,
    currentStreak: 3,
    longestStreak: 7,
    financialCompetencyScore: 68,
  };

  const financialToolsUsed: FinancialToolUsage[] = [
    {
      toolId: "budget-calculator",
      toolName: "Budget Calculator",
      lastUsedAt: new Date().toISOString(),
      useCount: 5,
    },
    {
      toolId: "net-worth-tracker",
      toolName: "Net Worth Tracker",
      lastUsedAt: new Date().toISOString(),
      useCount: 3,
    },
  ];

  return {
    profile,
    learningProgress,
    financialToolsUsed,
    sessionGoals: [],
  };
}

export function summarizeContext(context: MemberContext): string {
  const { profile, learningProgress, financialToolsUsed } = context;
  const inProgress = learningProgress.inProgressCourses
    .map((c) => `${c.courseTitle} (${c.percentComplete}%)`)
    .join(", ");

  return [
    `Member: ${profile.displayName} (${profile.membershipLevel})`,
    `Financial Competency Score: ${learningProgress.financialCompetencyScore}`,
    `Learning streak: ${learningProgress.currentStreak} days`,
    `Completed courses: ${learningProgress.completedCourseIds.length}`,
    inProgress ? `In progress: ${inProgress}` : "",
    `Tools used: ${financialToolsUsed.map((t) => t.toolName).join(", ")}`,
    `Learning goals: ${profile.learningGoals.join(", ")}`,
  ]
    .filter(Boolean)
    .join(" | ");
}
