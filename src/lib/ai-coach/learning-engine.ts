/**
 * Personalized Learning Engine
 * Generates adaptive learning paths and recommends content
 * based on competency scores, learning history, and goals.
 */

import {
  CompetencyArea,
  CompetencyScores,
  DifficultyLevel,
  LearningHistory,
  LearningItem,
  LearningPath,
  LearningPathStep,
} from "@/types/ai-coach";

// ─── Content catalog (stub — replace with CMS / DB queries) ───────────────

export const LEARNING_CATALOG: LearningItem[] = [
  // Personal Finance
  {
    id: "lc-pf-01",
    type: "course",
    title: "Personal Financial Management",
    category: "personalFinance",
    difficulty: "beginner",
    estimatedMinutes: 180,
    description: "Budgeting, savings automation, emergency funds, and debt elimination.",
    url: "/courses",
    tags: ["budgeting", "savings", "debt"],
    isFree: false,
  },
  {
    id: "lc-pf-02",
    type: "article",
    title: "The 50/30/20 Budget Rule Explained",
    category: "personalFinance",
    difficulty: "beginner",
    estimatedMinutes: 12,
    description: "How to allocate income for needs, wants, and savings.",
    url: "/blog",
    tags: ["budgeting", "savings"],
    isFree: true,
  },
  {
    id: "lc-pf-03",
    type: "video",
    title: "Build an Emergency Fund in 90 Days",
    category: "personalFinance",
    difficulty: "beginner",
    estimatedMinutes: 25,
    description: "Step-by-step guide to building your financial safety net.",
    url: "/videos",
    tags: ["emergency fund", "savings"],
    isFree: true,
  },
  {
    id: "lc-pf-04",
    type: "book",
    title: "Cash Flow Mastery",
    category: "personalFinance",
    difficulty: "intermediate",
    estimatedMinutes: 90,
    description: "Advanced personal cash flow management strategies.",
    url: "/books",
    tags: ["cash flow", "personal finance"],
    isFree: false,
  },
  // Investing
  {
    id: "lc-inv-01",
    type: "course",
    title: "Investing Fundamentals",
    category: "investing",
    difficulty: "beginner",
    estimatedMinutes: 240,
    description: "ETFs, index funds, portfolio construction, and compound interest.",
    url: "/courses",
    tags: ["investing", "ETF", "stocks"],
    isFree: false,
  },
  {
    id: "lc-inv-02",
    type: "article",
    title: "Index Funds vs. Individual Stocks",
    category: "investing",
    difficulty: "beginner",
    estimatedMinutes: 10,
    description: "Compare passive and active investing strategies.",
    url: "/blog",
    tags: ["index funds", "stocks"],
    isFree: true,
  },
  {
    id: "lc-inv-03",
    type: "video",
    title: "How Compound Interest Works",
    category: "investing",
    difficulty: "beginner",
    estimatedMinutes: 20,
    description: "Visual guide to the power of compounding over time.",
    url: "/videos",
    tags: ["compound interest", "investing"],
    isFree: true,
  },
  {
    id: "lc-inv-04",
    type: "course",
    title: "Advanced Portfolio Optimization",
    category: "investing",
    difficulty: "advanced",
    estimatedMinutes: 300,
    description: "Tax-efficient investing, rebalancing, and alternative assets.",
    url: "/courses",
    tags: ["portfolio", "tax", "advanced"],
    isFree: false,
  },
  // Real Estate
  {
    id: "lc-re-01",
    type: "course",
    title: "Building Wealth Through Real Estate",
    category: "realEstate",
    difficulty: "intermediate",
    estimatedMinutes: 300,
    description: "Leverage, financing, cash flow analysis, and rental management.",
    url: "/courses",
    tags: ["real estate", "rental", "leverage"],
    isFree: false,
  },
  {
    id: "lc-re-02",
    type: "video",
    title: "Analyzing Your First Rental Property",
    category: "realEstate",
    difficulty: "beginner",
    estimatedMinutes: 35,
    description: "Cap rate, cash-on-cash return, and deal analysis framework.",
    url: "/videos",
    tags: ["rental", "analysis", "cap rate"],
    isFree: true,
  },
  // Business
  {
    id: "lc-biz-01",
    type: "course",
    title: "Business Fundamentals",
    category: "business",
    difficulty: "beginner",
    estimatedMinutes: 360,
    description: "Profit, pricing, KPIs, leadership, marketing, and scaling.",
    url: "/courses",
    tags: ["business", "profit", "KPIs"],
    isFree: false,
  },
  {
    id: "lc-biz-02",
    type: "article",
    title: "Understanding Your Business KPIs",
    category: "business",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    description: "The 10 KPIs every business owner must track.",
    url: "/blog",
    tags: ["KPIs", "business metrics"],
    isFree: true,
  },
  // Risk Management
  {
    id: "lc-risk-01",
    type: "course",
    title: "Advanced Risk Management",
    category: "riskManagement",
    difficulty: "intermediate",
    estimatedMinutes: 150,
    description: "Insurance, asset protection, and scenario planning.",
    url: "/courses",
    tags: ["risk", "insurance", "asset protection"],
    isFree: false,
  },
];

// ─── Learning Path templates ───────────────────────────────────────────────

export function buildLearningPath(
  area: CompetencyArea,
  score: number
): LearningPath {
  const items = LEARNING_CATALOG.filter(
    (item) => item.category === area
  );

  const difficulty: DifficultyLevel =
    score < 50 ? "beginner" : score < 75 ? "intermediate" : "advanced";

  const filtered = items.filter(
    (item) =>
      item.difficulty === difficulty ||
      (difficulty === "advanced" && item.difficulty === "intermediate")
  );

  const steps: LearningPathStep[] = filtered.map((item, index) => ({
    order: index + 1,
    item,
    isCompleted: false,
    isUnlocked: index === 0,
  }));

  const areaLabels: Record<CompetencyArea, string> = {
    personalFinance: "Personal Finance",
    investing: "Investing",
    realEstate: "Real Estate",
    business: "Business",
    riskManagement: "Risk Management",
    financialProfile: "Financial Profile",
  };

  const totalMinutes = filtered.reduce((sum, i) => sum + i.estimatedMinutes, 0);

  return {
    id: `path-${area}`,
    title: `${areaLabels[area]} Learning Path`,
    description: `Adaptive learning path to improve your ${areaLabels[area]} competency from ${score} to 85+.`,
    category: area,
    difficulty,
    steps,
    estimatedHours: Math.round(totalMinutes / 60),
    competencyAward: `${areaLabels[area]} Certificate`,
    isAdaptive: true,
  };
}

// ─── Adaptive recommendations ─────────────────────────────────────────────

export function getAdaptiveLearningPaths(
  scores: CompetencyScores,
  completedItemIds: string[] = []
): LearningPath[] {
  const areas: CompetencyArea[] = [
    "personalFinance",
    "investing",
    "realEstate",
    "business",
    "riskManagement",
  ];

  return areas
    .filter((area) => scores[area] < 85)
    .sort((a, b) => scores[a] - scores[b]) // prioritize lowest scores
    .map((area) => {
      const path = buildLearningPath(area, scores[area]);
      // Mark completed steps
      path.steps = path.steps.map((step, idx) => ({
        ...step,
        isCompleted: completedItemIds.includes(step.item.id),
        isUnlocked:
          idx === 0 ||
          completedItemIds.includes(path.steps[idx - 1]?.item.id ?? ""),
      }));
      return path;
    });
}

export function getNextLearningItems(
  scores: CompetencyScores,
  completedItemIds: string[] = [],
  limit = 6
): LearningItem[] {
  const paths = getAdaptiveLearningPaths(scores, completedItemIds);
  const nextItems: LearningItem[] = [];

  for (const path of paths) {
    const next = path.steps.find(
      (s) => !s.isCompleted && s.isUnlocked
    );
    if (next) nextItems.push(next.item);
    if (nextItems.length >= limit) break;
  }

  return nextItems;
}

// ─── Demo learning history ─────────────────────────────────────────────────

export function getDemoLearningHistory(memberId: string): LearningHistory {
  return {
    memberId,
    completedItems: [
      { itemId: "lc-pf-02", type: "article", completedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
      { itemId: "lc-pf-03", type: "video", completedAt: new Date(Date.now() - 8 * 86400000).toISOString() },
      { itemId: "lc-inv-02", type: "article", completedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { itemId: "lc-inv-03", type: "video", completedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { itemId: "lc-re-02", type: "video", completedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    ],
    totalMinutes: 102,
    currentStreak: 5,
    longestStreak: 12,
    lastActivityAt: new Date(Date.now() - 86400000).toISOString(),
  };
}

// ─── Content type icons ────────────────────────────────────────────────────

export const CONTENT_TYPE_ICONS: Record<string, string> = {
  course: "📚",
  book: "📖",
  article: "📄",
  video: "🎬",
  audio: "🎧",
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-orange-400",
  expert: "text-red-400",
};
