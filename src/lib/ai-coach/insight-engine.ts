/**
 * Member Insight Engine
 * Derives strengths, weaknesses, trends, and improvement suggestions
 * from assessment results and learning history.
 */

import {
  CompetencyArea,
  CompetencyScores,
  CompetencyTrend,
  HistoricalScore,
  ImprovementSuggestion,
  InsightItem,
  MemberInsight,
  RecommendationPriority,
} from "@/types/ai-coach";

export const AREA_LABELS: Record<CompetencyArea, string> = {
  personalFinance: "Personal Finance",
  investing: "Investing",
  realEstate: "Real Estate",
  business: "Business",
  riskManagement: "Risk Management",
  financialProfile: "Financial Profile",
};

const COMPETENCY_AREAS: CompetencyArea[] = [
  "personalFinance",
  "investing",
  "realEstate",
  "business",
  "riskManagement",
  "financialProfile",
];

// ─── Insight derivation ────────────────────────────────────────────────────

function areaNote(area: CompetencyArea, score: number): string {
  const notes: Record<CompetencyArea, { low: string; mid: string; high: string }> = {
    personalFinance: {
      low: "Focus on budgeting, emergency fund, and debt elimination.",
      mid: "Strengthen cash flow management and automate savings.",
      high: "Excellent personal finance foundation. Optimize tax strategies.",
    },
    investing: {
      low: "Start with index funds and understand compound interest.",
      mid: "Diversify across asset classes and review your portfolio.",
      high: "Consider advanced strategies: options, alternative assets.",
    },
    realEstate: {
      low: "Learn the basics of rental income, mortgages, and leverage.",
      mid: "Analyze deals using cap rate and cash-on-cash return.",
      high: "Explore creative financing and commercial properties.",
    },
    business: {
      low: "Build core skills: pricing, profit margins, and cash flow.",
      mid: "Focus on scaling systems, KPIs, and team leadership.",
      high: "Expand into mergers, acquisitions, or passive income.",
    },
    riskManagement: {
      low: "Ensure adequate insurance and an asset protection plan.",
      mid: "Review your coverage annually and diversify risk.",
      high: "Implement advanced protection structures (trusts, entities).",
    },
    financialProfile: {
      low: "Build your credit score and understand your net worth.",
      mid: "Track net worth monthly and optimize credit utilization.",
      high: "Leverage strong credit for investment opportunities.",
    },
  };

  if (score < 50) return notes[area].low;
  if (score < 75) return notes[area].mid;
  return notes[area].high;
}

export function deriveInsights(
  scores: CompetencyScores,
  history: HistoricalScore[] = []
): MemberInsight {
  const allAreas = COMPETENCY_AREAS.map((area) => ({
    area,
    label: AREA_LABELS[area],
    score: scores[area],
    note: areaNote(area, scores[area]),
  }));

  const sorted = [...allAreas].sort((a, b) => b.score - a.score);
  const strengths: InsightItem[] = sorted.slice(0, 3).filter((a) => a.score >= 50);
  const weaknesses: InsightItem[] = sorted
    .slice()
    .reverse()
    .slice(0, 3)
    .filter((a) => a.score < 75);

  const trends: CompetencyTrend[] = deriveTrends(scores, history);
  const suggestions: ImprovementSuggestion[] = deriveImprovementSuggestions(scores);

  return { strengths, weaknesses, trends, suggestions, historicalScores: history };
}

function deriveTrends(
  current: CompetencyScores,
  history: HistoricalScore[]
): CompetencyTrend[] {
  if (history.length === 0) {
    return COMPETENCY_AREAS.map((area) => ({
      area,
      label: AREA_LABELS[area],
      direction: "stable" as const,
      changePercent: 0,
    }));
  }

  const previous = history[history.length - 1];

  return COMPETENCY_AREAS.map((area) => {
    const prev = previous.areas[area] ?? current[area];
    const curr = current[area];
    const diff = curr - prev;

    return {
      area,
      label: AREA_LABELS[area],
      direction:
        diff > 2 ? "improving" : diff < -2 ? "declining" : "stable",
      changePercent: Math.round(diff),
    };
  });
}

function deriveImprovementSuggestions(
  scores: CompetencyScores
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  const priorityMap = (score: number): RecommendationPriority =>
    score < 50 ? "critical" : score < 70 ? "high" : "medium";

  if (scores.personalFinance < 85) {
    suggestions.push({
      id: "sug-pf",
      area: "personalFinance",
      suggestion:
        "Complete the Personal Finance fundamentals course and set up automated savings.",
      priority: priorityMap(scores.personalFinance),
      estimatedImpact: "+12–18 points over 60 days",
    });
  }

  if (scores.investing < 85) {
    suggestions.push({
      id: "sug-inv",
      area: "investing",
      suggestion:
        "Open or review your investment account and add the Investing Fundamentals course.",
      priority: priorityMap(scores.investing),
      estimatedImpact: "+10–15 points over 90 days",
    });
  }

  if (scores.riskManagement < 75) {
    suggestions.push({
      id: "sug-risk",
      area: "riskManagement",
      suggestion:
        "Review your insurance coverage and establish an asset protection plan.",
      priority: priorityMap(scores.riskManagement),
      estimatedImpact: "+8–12 points over 30 days",
    });
  }

  if (scores.business < 75) {
    suggestions.push({
      id: "sug-biz",
      area: "business",
      suggestion:
        "Study cash flow management and pricing strategies in the Business Fundamentals course.",
      priority: priorityMap(scores.business),
      estimatedImpact: "+10–20 points over 120 days",
    });
  }

  if (scores.realEstate < 75) {
    suggestions.push({
      id: "sug-re",
      area: "realEstate",
      suggestion:
        "Begin analyzing rental properties with the Real Estate Wealth course.",
      priority: priorityMap(scores.realEstate),
      estimatedImpact: "+8–14 points over 90 days",
    });
  }

  return suggestions.sort((a, b) => {
    const w = { critical: 4, high: 3, medium: 2, low: 1 };
    return w[b.priority] - w[a.priority];
  });
}

// ─── Demo historical data (replace with DB) ───────────────────────────────

export function getDemoHistoricalScores(): HistoricalScore[] {
  return [
    {
      date: new Date(Date.now() - 90 * 86400000).toISOString(),
      overallScore: 58,
      areas: {
        personalFinance: 62,
        investing: 55,
        realEstate: 48,
        business: 60,
        riskManagement: 52,
        financialProfile: 70,
      },
    },
    {
      date: new Date(Date.now() - 60 * 86400000).toISOString(),
      overallScore: 67,
      areas: {
        personalFinance: 70,
        investing: 62,
        realEstate: 55,
        business: 65,
        riskManagement: 60,
        financialProfile: 72,
      },
    },
    {
      date: new Date(Date.now() - 30 * 86400000).toISOString(),
      overallScore: 74,
      areas: {
        personalFinance: 78,
        investing: 70,
        realEstate: 65,
        business: 72,
        riskManagement: 68,
        financialProfile: 78,
      },
    },
  ];
}
