/**
 * Rule-Based Recommendation Engine
 *
 * Architecture supports future AI/ML integration:
 * - Each rule is a pure function producing Recommendation[]
 * - Confidence scoring quantifies recommendation certainty
 * - Priority ranking determines display order
 * - Reasons explain why a recommendation was made
 *
 * Future AI integration: replace rule functions with ML model calls
 * while preserving the same Recommendation output interface.
 */

import {
  Recommendation,
  RecommendationContext,
  RecommendationType,
  RecommendationPriority,
} from "@/types/ai-coach";

let _idCounter = 0;

function makeId(prefix: string): string {
  _idCounter += 1;
  return `${prefix}-${_idCounter}`;
}

function rec(
  overrides: Partial<Recommendation> & {
    type: RecommendationType;
    title: string;
    description: string;
    reason: string;
    category: string;
    priority: RecommendationPriority;
    confidenceScore: number;
  }
): Recommendation {
  return {
    id: makeId("rec"),
    tags: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── Competency-based rules ────────────────────────────────────────────────

function competencyRules(ctx: RecommendationContext): Recommendation[] {
  const results: Recommendation[] = [];
  const scores = ctx.competencyScores;

  if (!scores) {
    results.push(
      rec({
        type: "assessment",
        title: "Complete Your Financial Assessment",
        description:
          "Get a personalized competency score across all 6 financial areas.",
        reason:
          "No assessment data found. Your competency baseline is required for personalized recommendations.",
        category: "Getting Started",
        priority: "critical",
        confidenceScore: 100,
        actionUrl: "/assessment",
        tags: ["assessment", "onboarding"],
      })
    );
    return results;
  }

  if (scores.personalFinance < 70) {
    results.push(
      rec({
        type: "course",
        title: "Personal Financial Management",
        description:
          "Master budgeting, savings, cash flow, emergency funds, and debt payoff.",
        reason: `Your Personal Finance score (${scores.personalFinance}) is below the 70-point threshold. Building this foundation improves every other area.`,
        category: "Personal Finance",
        priority: scores.personalFinance < 50 ? "critical" : "high",
        confidenceScore: 95,
        actionUrl: "/courses",
        estimatedTimeMinutes: 180,
        tags: ["budgeting", "savings", "debt"],
      })
    );
  }

  if (scores.investing < 70) {
    results.push(
      rec({
        type: "course",
        title: "Investing Fundamentals",
        description:
          "Learn ETFs, index funds, portfolio construction, and long-term wealth building.",
        reason: `Your Paper Assets / Investing score (${scores.investing}) indicates room for improvement. Starting earlier compounds over time.`,
        category: "Investing",
        priority: scores.investing < 50 ? "high" : "medium",
        confidenceScore: 90,
        actionUrl: "/courses",
        estimatedTimeMinutes: 240,
        tags: ["investing", "stocks", "ETF"],
      })
    );
  }

  if (scores.realEstate < 70) {
    results.push(
      rec({
        type: "course",
        title: "Building Wealth Through Real Estate",
        description:
          "Understand leverage, financing, cash flow analysis, and rental property management.",
        reason: `Your Real Estate score (${scores.realEstate}) is below competency. Real estate is one of Edunancial's four wealth pillars.`,
        category: "Real Estate",
        priority: "medium",
        confidenceScore: 88,
        actionUrl: "/courses",
        estimatedTimeMinutes: 300,
        tags: ["real estate", "rental", "leverage"],
      })
    );
  }

  if (scores.business < 70) {
    results.push(
      rec({
        type: "course",
        title: "Business Fundamentals",
        description:
          "Improve profit, pricing, KPIs, leadership, marketing, and business scaling.",
        reason: `Your Business score (${scores.business}) shows opportunity for growth. Business ownership is the fastest path to financial independence.`,
        category: "Business",
        priority: "medium",
        confidenceScore: 87,
        actionUrl: "/courses",
        estimatedTimeMinutes: 360,
        tags: ["business", "profit", "KPIs"],
      })
    );
  }

  if (scores.riskManagement < 70) {
    results.push(
      rec({
        type: "course",
        title: "Advanced Risk Management",
        description:
          "Protect your wealth with insurance, asset protection, and scenario planning.",
        reason: `Your Risk Management score (${scores.riskManagement}) suggests vulnerability in wealth preservation.`,
        category: "Risk Management",
        priority: "medium",
        confidenceScore: 85,
        actionUrl: "/courses",
        estimatedTimeMinutes: 150,
        tags: ["risk", "insurance", "asset protection"],
      })
    );
  }

  // High performer — suggest advanced content
  if (scores.overall >= 85) {
    results.push(
      rec({
        type: "course",
        title: "Advanced Portfolio Optimization",
        description:
          "Take your wealth to the next level with advanced diversification and tax strategies.",
        reason: `Your overall score (${scores.overall}) qualifies you for advanced-level content.`,
        category: "Advanced",
        priority: "low",
        confidenceScore: 80,
        actionUrl: "/courses",
        estimatedTimeMinutes: 120,
        tags: ["advanced", "portfolio", "tax"],
      })
    );
  }

  return results;
}

// ─── Goal-based rules ─────────────────────────────────────────────────────

function goalRules(ctx: RecommendationContext): Recommendation[] {
  const results: Recommendation[] = [];

  if (!ctx.goalCategories || ctx.goalCategories.length === 0) {
    results.push(
      rec({
        type: "action",
        title: "Set Your First Financial Goal",
        description:
          "Define a savings, debt payoff, or investment goal to start tracking progress.",
        reason:
          "Members with active goals are 3× more likely to build lasting financial competency.",
        category: "Goal Setting",
        priority: "high",
        confidenceScore: 92,
        actionUrl: "/ai-coach/goals",
        estimatedTimeMinutes: 10,
        tags: ["goals", "planning"],
      })
    );
    return results;
  }

  if (ctx.goalCategories.includes("debt")) {
    results.push(
      rec({
        type: "book",
        title: "The Total Money Makeover Principles",
        description:
          "Learn the debt snowball method and build momentum toward financial freedom.",
        reason:
          "You have an active debt payoff goal. This resource accelerates debt elimination.",
        category: "Debt Management",
        priority: "high",
        confidenceScore: 88,
        actionUrl: "/books",
        estimatedTimeMinutes: 60,
        tags: ["debt", "snowball", "budgeting"],
      })
    );
  }

  if (ctx.goalCategories.includes("retirement")) {
    results.push(
      rec({
        type: "article",
        title: "RRSP vs 401(k): Maximize Your Retirement",
        description:
          "Understand Canadian and US retirement accounts and contribution strategies.",
        reason:
          "You have a retirement goal. Optimizing account types compounds your returns.",
        category: "Retirement",
        priority: "medium",
        confidenceScore: 85,
        actionUrl: "/blog",
        estimatedTimeMinutes: 15,
        tags: ["retirement", "RRSP", "401k"],
      })
    );
  }

  if (ctx.goalCategories.includes("homeOwnership")) {
    results.push(
      rec({
        type: "video",
        title: "First-Time Home Buyer Masterclass",
        description:
          "Understand mortgages, down payments, credit scores, and closing costs.",
        reason:
          "Your home ownership goal requires understanding of the mortgage process.",
        category: "Real Estate",
        priority: "medium",
        confidenceScore: 87,
        actionUrl: "/videos",
        estimatedTimeMinutes: 45,
        tags: ["home", "mortgage", "real estate"],
      })
    );
  }

  if (ctx.goalCategories.includes("businessOwnership")) {
    results.push(
      rec({
        type: "marketplaceProduct",
        title: "Business Launch Toolkit",
        description:
          "Templates, worksheets, and guides to legally register and launch your business.",
        reason:
          "Your business ownership goal is supported by this step-by-step launch toolkit.",
        category: "Business",
        priority: "high",
        confidenceScore: 90,
        actionUrl: "/marketplace",
        estimatedTimeMinutes: 0,
        tags: ["business", "launch", "entrepreneur"],
      })
    );
  }

  return results;
}

// ─── Onboarding rules ─────────────────────────────────────────────────────

function onboardingRules(ctx: RecommendationContext): Recommendation[] {
  const results: Recommendation[] = [];

  if (!ctx.assessmentCompleted) {
    results.push(
      rec({
        type: "assessment",
        title: "Take the Financial Competency Assessment",
        description:
          "A 30-question assessment across 6 areas to establish your competency baseline.",
        reason:
          "Completing the assessment unlocks fully personalized recommendations, learning paths, and your Financial Competency Score.",
        category: "Onboarding",
        priority: "critical",
        confidenceScore: 100,
        actionUrl: "/assessment",
        estimatedTimeMinutes: 20,
        tags: ["assessment", "onboarding", "competency"],
      })
    );
  }

  return results;
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Generate prioritized recommendations for a member.
 *
 * Future AI integration point: inject an AI scoring function via the
 * optional `aiScorer` parameter to blend rule-based and ML scores.
 */
export function generateRecommendations(
  ctx: RecommendationContext,
  options?: {
    limit?: number;
    /** Future: async AI scoring override per recommendation */
    aiScorer?: (rec: Recommendation) => number;
  }
): Recommendation[] {
  const all: Recommendation[] = [
    ...onboardingRules(ctx),
    ...competencyRules(ctx),
    ...goalRules(ctx),
  ];

  // Apply optional AI score override
  if (options?.aiScorer) {
    all.forEach((r) => {
      r.confidenceScore = options.aiScorer!(r);
    });
  }

  // Sort: priority weight × confidence
  const priorityWeight: Record<RecommendationPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const sorted = all.sort((a, b) => {
    const scoreA = priorityWeight[a.priority] * a.confidenceScore;
    const scoreB = priorityWeight[b.priority] * b.confidenceScore;
    return scoreB - scoreA;
  });

  return options?.limit ? sorted.slice(0, options.limit) : sorted;
}

export function getTopRecommendations(
  ctx: RecommendationContext,
  count = 5
): Recommendation[] {
  return generateRecommendations(ctx, { limit: count });
}
