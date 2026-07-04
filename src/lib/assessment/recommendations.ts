import { CompetencyScores } from "./scoring";

export interface CourseRecommendation {
  id: string;
  title: string;
  category: string;
  priority: number;
  reason: string;
}

export function generateCourseRecommendations(
  scores: CompetencyScores
): CourseRecommendation[] {

  const recommendations: CourseRecommendation[] = [];

  if (scores.personalFinance < 85) {
    recommendations.push({
      id: "personal-finance",
      title: "Personal Financial Management",
      category: "Personal Finance",
      priority: 1,
      reason:
        "Strengthen budgeting, savings, cash flow and debt management.",
    });
  }

  if (scores.investing < 85) {
    recommendations.push({
      id: "investing",
      title: "Investing Fundamentals",
      category: "Paper Assets",
      priority: 2,
      reason:
        "Build confidence in long-term investing and portfolio construction.",
    });
  }

  if (scores.realEstate < 85) {
    recommendations.push({
      id: "real-estate",
      title: "Building Wealth Through Real Estate",
      category: "Real Estate",
      priority: 3,
      reason:
        "Expand your understanding of leverage, financing and cash flow.",
    });
  }

  if (scores.business < 85) {
    recommendations.push({
      id: "business",
      title: "Business Fundamentals",
      category: "Business",
      priority: 4,
      reason:
        "Improve profit, pricing, KPIs and business strategy.",
    });
  }

  if (scores.riskManagement < 85) {
    recommendations.push({
      id: "risk",
      title: "Risk Management",
      category: "Risk Management",
      priority: 5,
      reason:
        "Protect your wealth through proper planning and asset protection.",
    });
  }

  recommendations.sort((a, b) => a.priority - b.priority);

  return recommendations;
}

export function recommendedLearningPath(
  scores: CompetencyScores
): string[] {

  const path: string[] = [];

  if (scores.personalFinance < 70) {
    path.push("Personal Financial Management");
  }

  if (scores.investing < 70) {
    path.push("Investing Fundamentals");
  }

  if (scores.realEstate < 70) {
    path.push("Building Wealth Through Real Estate");
  }

  if (scores.business < 70) {
    path.push("Business Fundamentals");
  }

  if (scores.riskManagement < 70) {
    path.push("Risk Management & Asset Protection");
  }

  if (scores.financialProfile < 70) {
    path.push("Creating Your Financial Plan");
  }

  if (path.length === 0) {
    path.push("Executive Financial Competency");
    path.push("Global Investing");
    path.push("Advanced Business Scaling");
  }

  return path;
}

export function estimatedImprovement(
  currentScore: number
): number {

  if (currentScore >= 90) return 100;

  if (currentScore >= 80) return 95;

  if (currentScore >= 70) return 90;

  if (currentScore >= 60) return 85;

  if (currentScore >= 50) return 80;

  return 75;
}

export function nextAssessmentDate(): string {

  const today = new Date();

  today.setMonth(today.getMonth() + 3);

  return today.toLocaleDateString();
}

export function certificateEligible(
  score: number
): boolean {

  return score >= 80;
}

