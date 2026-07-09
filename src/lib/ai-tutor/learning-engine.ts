// ─── Personalized Learning Engine ─────────────────────────────────────────────
// Generates course recommendations, learning paths, and adaptive sequencing.
// Uses placeholder logic; replace with ML-based recommendations in production.

import type {
  MemberContext,
  CourseRecommendation,
  CalculatorRecommendation,
  LearningPath,
  LearningPathStep,
  DifficultyLevel,
  LearningGoal,
} from "./types";

// ─── Course Catalog (Placeholder) ────────────────────────────────────────────

const COURSE_CATALOG: CourseRecommendation[] = [
  {
    courseId: "budgeting-101",
    title: "Budgeting 101",
    description: "Master the foundation of personal finance with proven budgeting strategies.",
    difficulty: "beginner",
    estimatedHours: 2,
    relevanceScore: 0,
    reason: "",
    url: "/courses/budgeting-101",
  },
  {
    courseId: "emergency-fund",
    title: "Building Your Emergency Fund",
    description: "Learn why and how to build a 3–6 month emergency cushion.",
    difficulty: "beginner",
    estimatedHours: 1,
    relevanceScore: 0,
    reason: "",
    url: "/courses/emergency-fund",
  },
  {
    courseId: "debt-elimination",
    title: "Debt Elimination Strategies",
    description: "Avalanche vs. snowball: scientifically compare debt payoff strategies.",
    difficulty: "beginner",
    estimatedHours: 2,
    relevanceScore: 0,
    reason: "",
    url: "/courses/debt-elimination",
  },
  {
    courseId: "investing-fundamentals",
    title: "Investing Fundamentals",
    description: "Understand stocks, bonds, ETFs and the power of compounding.",
    difficulty: "intermediate",
    estimatedHours: 4,
    relevanceScore: 0,
    reason: "",
    url: "/courses/investing-fundamentals",
  },
  {
    courseId: "real-estate-basics",
    title: "Real Estate Investing Basics",
    description: "How to evaluate, finance, and profit from real estate.",
    difficulty: "intermediate",
    estimatedHours: 5,
    relevanceScore: 0,
    reason: "",
    url: "/courses/real-estate-basics",
  },
  {
    courseId: "business-finance",
    title: "Business Finance Essentials",
    description: "P&L, cash flow, and financial statements for entrepreneurs.",
    difficulty: "intermediate",
    estimatedHours: 3,
    relevanceScore: 0,
    reason: "",
    url: "/courses/business-finance",
  },
  {
    courseId: "retirement-planning",
    title: "Retirement Planning",
    description: "401(k), IRA, RRSP strategies to retire on your timeline.",
    difficulty: "intermediate",
    estimatedHours: 3,
    relevanceScore: 0,
    reason: "",
    url: "/courses/retirement-planning",
  },
  {
    courseId: "wealth-building-advanced",
    title: "Advanced Wealth Building",
    description: "Multi-asset portfolio construction, tax efficiency, and legacy planning.",
    difficulty: "advanced",
    estimatedHours: 6,
    relevanceScore: 0,
    reason: "",
    url: "/courses/wealth-building-advanced",
  },
];

// ─── Calculator Catalog (Placeholder) ────────────────────────────────────────

const CALCULATOR_CATALOG: CalculatorRecommendation[] = [
  {
    calculatorId: "budget-calculator",
    title: "Budget Calculator",
    description: "Create a personalized monthly budget.",
    url: "/financial-tools/budget-calculator",
    relevanceScore: 0,
    reason: "",
  },
  {
    calculatorId: "net-worth-tracker",
    title: "Net Worth Tracker",
    description: "Track your assets and liabilities over time.",
    url: "/financial-tools/net-worth-tracker",
    relevanceScore: 0,
    reason: "",
  },
  {
    calculatorId: "investment-calculator",
    title: "Investment Growth Calculator",
    description: "Project how investments compound over time.",
    url: "/financial-tools/investment-calculator",
    relevanceScore: 0,
    reason: "",
  },
  {
    calculatorId: "debt-payoff",
    title: "Debt Payoff Calculator",
    description: "Compare avalanche vs. snowball payoff timelines.",
    url: "/financial-tools/debt-payoff",
    relevanceScore: 0,
    reason: "",
  },
  {
    calculatorId: "retirement-calculator",
    title: "Retirement Calculator",
    description: "Estimate how much you need to retire comfortably.",
    url: "/financial-tools/retirement-calculator",
    relevanceScore: 0,
    reason: "",
  },
];

// ─── Goal-to-Course Mapping ───────────────────────────────────────────────────

const GOAL_COURSE_MAP: Record<LearningGoal, string[]> = {
  budgeting: ["budgeting-101", "emergency-fund"],
  investing: ["investing-fundamentals", "wealth-building-advanced"],
  real_estate: ["real-estate-basics", "investing-fundamentals"],
  business: ["business-finance", "investing-fundamentals"],
  debt_elimination: ["debt-elimination", "budgeting-101"],
  retirement: ["retirement-planning", "investing-fundamentals"],
  entrepreneurship: ["business-finance", "investing-fundamentals"],
  wealth_building: ["wealth-building-advanced", "investing-fundamentals", "real-estate-basics"],
};

// ─── Difficulty Inference ─────────────────────────────────────────────────────

function inferDifficulty(completedCount: number, score: number): DifficultyLevel {
  if (completedCount >= 5 || score >= 70) return "advanced";
  if (completedCount >= 2 || score >= 40) return "intermediate";
  return "beginner";
}

// ─── Recommendation Engine ────────────────────────────────────────────────────

export function getRecommendedCourses(
  context: MemberContext,
  limit = 4
): CourseRecommendation[] {
  const { profile, learningProgress } = context;
  const completed = new Set(learningProgress.completedCourseIds);
  const inProgress = new Set(
    learningProgress.inProgressCourses.map((c) => c.courseId)
  );
  const userDifficulty = inferDifficulty(
    learningProgress.completedCourseIds.length,
    learningProgress.financialCompetencyScore
  );

  // Score each course based on relevance
  const scored = COURSE_CATALOG.filter(
    (c) => !completed.has(c.courseId) && !inProgress.has(c.courseId)
  ).map((course) => {
    let score = 0;

    // Boost if aligned with goals
    for (const goal of profile.learningGoals) {
      if (GOAL_COURSE_MAP[goal]?.includes(course.courseId)) {
        score += 30;
      }
    }

    // Prefer courses matching current difficulty
    if (course.difficulty === userDifficulty) score += 20;
    if (course.difficulty === "beginner" && userDifficulty === "intermediate") score += 5;

    // Shorter courses score higher for engagement
    score += Math.max(0, 10 - course.estimatedHours);

    return {
      ...course,
      relevanceScore: score,
      reason: buildCourseReason(course, profile.learningGoals, userDifficulty),
    };
  });

  return scored.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
}

function buildCourseReason(
  course: CourseRecommendation,
  goals: LearningGoal[],
  difficulty: DifficultyLevel
): string {
  for (const goal of goals) {
    if (GOAL_COURSE_MAP[goal]?.includes(course.courseId)) {
      return `Aligned with your ${goal.replace(/_/g, " ")} goal`;
    }
  }
  if (course.difficulty === difficulty) {
    return `Matches your current ${difficulty} learning level`;
  }
  return "Recommended for your learning journey";
}

// ─── Calculator Recommendations ───────────────────────────────────────────────

export function getRecommendedCalculators(
  context: MemberContext,
  limit = 3
): CalculatorRecommendation[] {
  const usedIds = new Set(context.financialToolsUsed.map((t) => t.toolId));

  const scored = CALCULATOR_CATALOG.map((calc) => {
    let score = 0;

    // Prefer unused calculators
    if (!usedIds.has(calc.calculatorId)) score += 20;

    // Align with goals
    if (
      context.profile.learningGoals.includes("budgeting") &&
      calc.calculatorId === "budget-calculator"
    )
      score += 30;
    if (
      context.profile.learningGoals.includes("investing") &&
      calc.calculatorId === "investment-calculator"
    )
      score += 30;
    if (
      context.profile.learningGoals.includes("retirement") &&
      calc.calculatorId === "retirement-calculator"
    )
      score += 30;
    if (
      context.profile.learningGoals.includes("debt_elimination") &&
      calc.calculatorId === "debt-payoff"
    )
      score += 30;

    return {
      ...calc,
      relevanceScore: score,
      reason: "Supports your financial learning goals",
    };
  });

  return scored.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
}

// ─── Learning Path Generator ──────────────────────────────────────────────────

export function generateLearningPath(context: MemberContext): LearningPath {
  const { profile, learningProgress } = context;
  const primaryGoal = profile.learningGoals[0] ?? "wealth_building";
  const completed = new Set(learningProgress.completedCourseIds);
  const difficulty = inferDifficulty(
    learningProgress.completedCourseIds.length,
    learningProgress.financialCompetencyScore
  );

  const courseIds = GOAL_COURSE_MAP[primaryGoal] ?? [];
  const allCourseIds = [
    ...courseIds,
    ...COURSE_CATALOG.filter((c) => c.difficulty === difficulty && !courseIds.includes(c.courseId))
      .slice(0, 2)
      .map((c) => c.courseId),
  ];

  const steps: LearningPathStep[] = allCourseIds.map((courseId, index) => {
    const course = COURSE_CATALOG.find((c) => c.courseId === courseId);
    const isCompleted = completed.has(courseId);
    const isUnlocked = index === 0 || completed.has(allCourseIds[index - 1]);

    return {
      stepId: `step-${index + 1}`,
      title: course?.title ?? courseId,
      description: course?.description ?? "",
      courseId,
      estimatedMinutes: (course?.estimatedHours ?? 1) * 60,
      difficulty: course?.difficulty ?? difficulty,
      isCompleted,
      isUnlocked,
    };
  });

  const completedSteps = steps.filter((s) => s.isCompleted).length;
  const totalMinutes = steps.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  return {
    pathId: `path-${primaryGoal}`,
    title: `${primaryGoal.replace(/_/g, " ")} Mastery Path`,
    description: `A personalized path to master ${primaryGoal.replace(/_/g, " ")} based on your goals and progress.`,
    goal: primaryGoal,
    steps,
    estimatedTotalHours: Math.round(totalMinutes / 60),
    difficulty,
    percentComplete: steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0,
  };
}

// ─── Suggested Questions ──────────────────────────────────────────────────────

export function getSuggestedQuestions(context: MemberContext): string[] {
  const { profile, learningProgress } = context;
  const questions: string[] = [];

  if (profile.learningGoals.includes("budgeting")) {
    questions.push("What is the 50/30/20 budgeting rule?");
    questions.push("How do I stop living paycheck to paycheck?");
  }

  if (profile.learningGoals.includes("investing")) {
    questions.push("What is compound interest and why does it matter?");
    questions.push("What's the difference between a stock and an ETF?");
  }

  if (profile.learningGoals.includes("real_estate")) {
    questions.push("How do I analyze a rental property deal?");
    questions.push("What is the BRRRR method in real estate?");
  }

  if (profile.learningGoals.includes("debt_elimination")) {
    questions.push("What's the difference between avalanche and snowball methods?");
    questions.push("How do I negotiate a lower interest rate?");
  }

  if (learningProgress.inProgressCourses.length > 0) {
    const course = learningProgress.inProgressCourses[0];
    questions.push(`What are the key concepts in ${course.courseTitle}?`);
  }

  // Fill with universal financial education questions
  const universal = [
    "What is a financial competency score?",
    "How do I build an emergency fund?",
    "What is the difference between an asset and a liability?",
    "How does inflation affect my savings?",
    "What is dollar-cost averaging?",
  ];

  for (const q of universal) {
    if (questions.length >= 6) break;
    if (!questions.includes(q)) questions.push(q);
  }

  return questions.slice(0, 6);
}
