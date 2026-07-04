import { CompetencyScores } from "./scoring";

export interface RoadmapItem {
  priority: number;
  title: string;
  description: string;
  courseCategory: string;
}

export function generateLearningRoadmap(
  scores: CompetencyScores
): RoadmapItem[] {

  const roadmap: RoadmapItem[] = [];

  if (scores.personalFinance < 70) {
    roadmap.push({
      priority: 1,
      title: "Strengthen Personal Financial Management",
      description:
        "Develop stronger budgeting, savings, cash flow, and debt management skills.",
      courseCategory: "Personal Finance",
    });
  }

  if (scores.investing < 70) {
    roadmap.push({
      priority: 2,
      title: "Improve Investment Knowledge",
      description:
        "Learn diversification, ETFs, stocks, retirement planning, and long-term investing.",
      courseCategory: "Investing",
    });
  }

  if (scores.realEstate < 70) {
    roadmap.push({
      priority: 3,
      title: "Expand Real Estate Competency",
      description:
        "Study residential investing, commercial property, creative financing, and 1031 exchanges.",
      courseCategory: "Real Estate",
    });
  }

  if (scores.business < 70) {
    roadmap.push({
      priority: 4,
      title: "Build Business Competency",
      description:
        "Master profit, pricing, KPIs, leadership, marketing, and scaling.",
      courseCategory: "Business",
    });
  }

  if (scores.riskManagement < 70) {
    roadmap.push({
      priority: 5,
      title: "Improve Risk Management",
      description:
        "Strengthen emergency planning, insurance, diversification, and asset protection.",
      courseCategory: "Risk Management",
    });
  }

  if (scores.financialProfile < 70) {
    roadmap.push({
      priority: 6,
      title: "Clarify Financial Goals",
      description:
        "Develop a written long-term financial strategy with measurable milestones.",
      courseCategory: "Financial Planning",
    });
  }

  return roadmap.sort((a, b) => a.priority - b.priority);
}

  export function nextRecommendedCourse(
  scores: CompetencyScores
): string {

  const lowest = Math.min(
    scores.personalFinance,
    scores.investing,
    scores.realEstate,
    scores.business,
    scores.riskManagement,
    scores.financialProfile
  );

  switch (lowest) {

    case scores.personalFinance:
      return "Personal Financial Management";

    case scores.investing:
      return "Investing Fundamentals";

    case scores.realEstate:
      return "Building Wealth Through Real Estate";

    case scores.business:
      return "Business Fundamentals";

    case scores.riskManagement:
      return "Risk Management";

    default:
      return "Financial Goal Planning";
  }
}

export function estimatedCompetencyLevel(
  score: number
): string {

  if (score >= 95) return "Master";
  if (score >= 85) return "Advanced";
  if (score >= 70) return "Proficient";
  if (score >= 55) return "Developing";
  if (score >= 40) return "Foundation";

  return "Beginning";
}

export function recommendedStudyHours(
  score: number
): number {

  if (score >= 90) return 10;
  if (score >= 80) return 20;
  if (score >= 70) return 35;
  if (score >= 60) return 50;
  if (score >= 50) return 75;

  return 100;
}

export function estimatedCompletionMonths(
  score: number
): number {

  if (score >= 90) return 3;
  if (score >= 80) return 6;
  if (score >= 70) return 9;
  if (score >= 60) return 12;
  if (score >= 50) return 18;

  return 24;
}
