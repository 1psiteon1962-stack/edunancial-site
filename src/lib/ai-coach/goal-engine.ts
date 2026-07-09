/**
 * Financial Goal Engine
 * Manages creation, calculation, and status evaluation of financial goals.
 * Designed for future Supabase / database integration.
 */

import {
  FinancialGoal,
  GoalCategory,
  GoalProgress,
  GoalStatus,
} from "@/types/ai-coach";

// ─── Demo seed data ────────────────────────────────────────────────────────
// Replace with database queries in production.

const DEMO_GOALS: FinancialGoal[] = [
  {
    id: "goal-001",
    memberId: "demo",
    title: "Emergency Fund",
    category: "savings",
    description: "Build a 6-month emergency fund",
    targetAmount: 18000,
    currentAmount: 7200,
    targetDate: new Date(Date.now() + 180 * 86400000).toISOString(),
    startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
    status: "inProgress",
    currency: "USD",
    milestones: [
      { id: "m1", title: "1 Month Saved", targetAmount: 3000, completedAt: new Date(Date.now() - 60 * 86400000).toISOString() },
      { id: "m2", title: "3 Months Saved", targetAmount: 9000 },
      { id: "m3", title: "6 Months Saved", targetAmount: 18000 },
    ],
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "goal-002",
    memberId: "demo",
    title: "Eliminate Credit Card Debt",
    category: "debt",
    description: "Pay off all credit card balances using the debt snowball method",
    targetAmount: 8500,
    currentAmount: 3400,
    targetDate: new Date(Date.now() + 365 * 86400000).toISOString(),
    startDate: new Date(Date.now() - 120 * 86400000).toISOString(),
    status: "onTrack",
    currency: "USD",
    milestones: [
      { id: "m4", title: "50% Paid Off", targetAmount: 4250 },
      { id: "m5", title: "Debt Free", targetAmount: 8500 },
    ],
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "goal-003",
    memberId: "demo",
    title: "Investment Portfolio",
    category: "investment",
    description: "Build a diversified investment portfolio",
    targetAmount: 50000,
    currentAmount: 12500,
    targetDate: new Date(Date.now() + 730 * 86400000).toISOString(),
    startDate: new Date(Date.now() - 180 * 86400000).toISOString(),
    status: "inProgress",
    currency: "USD",
    milestones: [
      { id: "m6", title: "$10K Invested", targetAmount: 10000, completedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
      { id: "m7", title: "$25K Invested", targetAmount: 25000 },
      { id: "m8", title: "$50K Invested", targetAmount: 50000 },
    ],
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Goal CRUD (stub, replace with DB calls) ───────────────────────────────

export async function getGoals(memberId: string): Promise<FinancialGoal[]> {
  return DEMO_GOALS.filter((g) => g.memberId === memberId || memberId === "demo");
}

export async function getGoalById(id: string): Promise<FinancialGoal | null> {
  return DEMO_GOALS.find((g) => g.id === id) ?? null;
}

export async function createGoal(
  data: Omit<FinancialGoal, "id" | "createdAt" | "updatedAt" | "status">
): Promise<FinancialGoal> {
  const goal: FinancialGoal = {
    ...data,
    id: `goal-${Date.now()}`,
    status: "notStarted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  DEMO_GOALS.push(goal);
  return goal;
}

export async function updateGoalProgress(
  id: string,
  currentAmount: number
): Promise<FinancialGoal | null> {
  const goal = DEMO_GOALS.find((g) => g.id === id);
  if (!goal) return null;
  goal.currentAmount = currentAmount;
  goal.updatedAt = new Date().toISOString();
  goal.status = deriveGoalStatus(goal);
  return goal;
}

// ─── Calculations ─────────────────────────────────────────────────────────

export function calculateGoalProgress(goal: FinancialGoal): GoalProgress {
  const percentComplete = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  );

  const amountRemaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const now = Date.now();
  const target = new Date(goal.targetDate).getTime();
  const start = new Date(goal.startDate).getTime();
  const daysRemaining = Math.max(0, Math.ceil((target - now) / 86400000));
  const totalDays = Math.max(1, Math.ceil((target - start) / 86400000));
  const elapsedDays = Math.max(0, Math.ceil((now - start) / 86400000));

  // Project linear completion
  const dailyRate = elapsedDays > 0 ? goal.currentAmount / elapsedDays : 0;
  const daysNeededFromNow =
    dailyRate > 0 ? Math.ceil(amountRemaining / dailyRate) : totalDays;

  const projectedMs = now + daysNeededFromNow * 86400000;
  const projectedCompletionDate = new Date(projectedMs).toISOString();

  const isOnTrack = projectedMs <= target;

  const weeklyRequired =
    daysRemaining > 0
      ? parseFloat(((amountRemaining / daysRemaining) * 7).toFixed(2))
      : 0;

  return {
    goal,
    percentComplete,
    amountRemaining,
    daysRemaining,
    isOnTrack,
    projectedCompletionDate,
    weeklyRequired,
  };
}

export function calculateAllGoalsProgress(
  goals: FinancialGoal[]
): GoalProgress[] {
  return goals.map(calculateGoalProgress);
}

export function deriveGoalStatus(goal: FinancialGoal): GoalStatus {
  if (goal.currentAmount >= goal.targetAmount) return "completed";
  const progress = calculateGoalProgress(goal);
  if (progress.percentComplete === 0) return "notStarted";
  if (!progress.isOnTrack) return "atRisk";
  return "onTrack";
}

// ─── Category metadata ─────────────────────────────────────────────────────

export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  savings: "Savings",
  debt: "Debt Payoff",
  investment: "Investment",
  retirement: "Retirement",
  homeOwnership: "Home Ownership",
  businessOwnership: "Business Ownership",
  custom: "Custom Goal",
};

export const GOAL_CATEGORY_ICONS: Record<GoalCategory, string> = {
  savings: "💰",
  debt: "📉",
  investment: "📈",
  retirement: "🏖️",
  homeOwnership: "🏠",
  businessOwnership: "🏢",
  custom: "🎯",
};

export const GOAL_CATEGORY_COLORS: Record<GoalCategory, string> = {
  savings: "green",
  debt: "red",
  investment: "blue",
  retirement: "purple",
  homeOwnership: "yellow",
  businessOwnership: "orange",
  custom: "slate",
};
