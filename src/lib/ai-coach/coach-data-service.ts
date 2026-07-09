/**
 * AI Coach Data Service
 * Aggregates all data needed for the AI Coach Dashboard.
 * Replace stubs with real database/auth calls as services are built.
 */

import {
  AICoachDashboardData,
  Achievement,
  CompetencyLevel,
  CompetencyScores,
  NextAction,
} from "@/types/ai-coach";
import { getGoals, calculateAllGoalsProgress } from "./goal-engine";
import { getTopRecommendations } from "./recommendation-engine";
import { getDemoHistoricalScores } from "./insight-engine";
import { getDemoLearningHistory } from "./learning-engine";
import { getDemoNotifications } from "./notification-manager";

// ─── Demo competency scores ────────────────────────────────────────────────
// Replace with assessment results from database.

const DEMO_SCORES: CompetencyScores = {
  overall: 78,
  personalFinance: 85,
  investing: 72,
  realEstate: 68,
  business: 82,
  riskManagement: 71,
  financialProfile: 88,
};

// ─── Competency level thresholds ──────────────────────────────────────────

export function deriveCompetencyLevel(score: number): CompetencyLevel {
  if (score >= 90) return "Expert";
  if (score >= 80) return "Proficient";
  if (score >= 65) return "Competent";
  if (score >= 45) return "Developing";
  return "Beginner";
}

// ─── Demo achievements ────────────────────────────────────────────────────

const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-001",
    title: "First Assessment",
    description: "Completed your first Financial Competency Assessment.",
    icon: "🥇",
    earnedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    category: "Assessment",
  },
  {
    id: "ach-002",
    title: "Goal Setter",
    description: "Created your first financial goal.",
    icon: "🎯",
    earnedAt: new Date(Date.now() - 85 * 86400000).toISOString(),
    category: "Goals",
  },
  {
    id: "ach-003",
    title: "Investment Explorer",
    description: "Started your first investing course.",
    icon: "📈",
    earnedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    category: "Learning",
  },
  {
    id: "ach-004",
    title: "Real Estate Student",
    description: "Completed a real estate learning module.",
    icon: "🏘️",
    earnedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    category: "Learning",
  },
  {
    id: "ach-005",
    title: "5-Day Streak",
    description: "Learned for 5 consecutive days.",
    icon: "🔥",
    earnedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    category: "Engagement",
  },
  {
    id: "ach-006",
    title: "Business Builder",
    description: "Achieved 80+ in Business competency.",
    icon: "💼",
    earnedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    category: "Competency",
  },
];

// ─── Next actions ─────────────────────────────────────────────────────────

function buildNextActions(
  scores: CompetencyScores,
  assessmentCompleted: boolean
): NextAction[] {
  const actions: NextAction[] = [];

  if (!assessmentCompleted) {
    actions.push({
      id: "na-assessment",
      title: "Complete Financial Assessment",
      description: "Establish your competency baseline and unlock personalized recommendations.",
      type: "assessment",
      priority: "critical",
      estimatedMinutes: 20,
      actionUrl: "/assessment",
    });
    return actions;
  }

  // Weakest area first
  const areaScores = [
    { area: "personalFinance", score: scores.personalFinance, label: "Personal Finance", url: "/courses" },
    { area: "investing", score: scores.investing, label: "Investing", url: "/courses" },
    { area: "realEstate", score: scores.realEstate, label: "Real Estate", url: "/courses" },
    { area: "business", score: scores.business, label: "Business", url: "/courses" },
    { area: "riskManagement", score: scores.riskManagement, label: "Risk Management", url: "/courses" },
  ].sort((a, b) => a.score - b.score);

  const weakest = areaScores[0];
  actions.push({
    id: `na-course-${weakest.area}`,
    title: `Study ${weakest.label}`,
    description: `Your ${weakest.label} score (${weakest.score}) is your lowest area. One lesson today moves the needle.`,
    type: "course",
    priority: weakest.score < 60 ? "critical" : "high",
    estimatedMinutes: 30,
    actionUrl: weakest.url,
  });

  actions.push({
    id: "na-goal-review",
    title: "Review Your Goals",
    description: "Check your goal progress and update amounts to stay on track.",
    type: "goal",
    priority: "medium",
    estimatedMinutes: 10,
    actionUrl: "/ai-coach/goals",
  });

  if (scores.overall >= 75) {
    actions.push({
      id: "na-advanced",
      title: "Take Advanced Course",
      description: "Your score qualifies you for advanced-level content.",
      type: "course",
      priority: "low",
      estimatedMinutes: 45,
      actionUrl: "/courses",
    });
  }

  return actions.slice(0, 5);
}

// ─── Main data aggregator ─────────────────────────────────────────────────

export async function getAICoachDashboardData(
  memberId = "demo"
): Promise<AICoachDashboardData> {
  // In production: fetch from DB, auth, and assessment service
  const memberName = "Alex";
  const membershipLevel = "Premium";
  const assessmentCompleted = true;
  const scores: CompetencyScores = DEMO_SCORES;

  const goals = await getGoals(memberId);
  const goalProgress = calculateAllGoalsProgress(goals);

  const recommendations = getTopRecommendations(
    {
      competencyScores: scores,
      goalCategories: goals.map((g) => g.category),
      assessmentCompleted,
      membershipLevel,
    },
    6
  );

  const nextActions = buildNextActions(scores, assessmentCompleted);
  const notifications = getDemoNotifications(memberId);
  const learningHistory = getDemoLearningHistory(memberId);

  return {
    memberName,
    membershipLevel,
    aiCoachEnabled: true,
    competencyScores: scores,
    competencyLevel: deriveCompetencyLevel(scores.overall),
    goals: goalProgress,
    topRecommendations: recommendations,
    nextActions,
    recentNotifications: notifications.slice(0, 5),
    learningHistory,
    achievements: DEMO_ACHIEVEMENTS,
    assessmentCompleted,
  };
}

export { DEMO_SCORES, getDemoHistoricalScores };
