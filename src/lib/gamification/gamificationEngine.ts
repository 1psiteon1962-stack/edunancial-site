import type { UserProgress, UserAchievement, PointsEvent, PointsTransaction, UserPoints } from "./types";
import { ACHIEVEMENT_DEFINITIONS, RULE_EVALUATORS } from "./achievements";
import { getPointValue } from "./pointsConfig";

// ─── Gamification Engine ──────────────────────────────────────────────────────
//
// This engine is stateless — it computes derived state from inputs.
// Wire it to your data store (Supabase, local state, etc.) as needed.
// All functions are pure and AI-integration friendly.

// ── Achievement Evaluation ────────────────────────────────────────────────────

/**
 * Evaluate all achievement definitions against a user's progress snapshot.
 * Returns the full list of UserAchievement states (earned + progress).
 *
 * For already-earned achievements (from persistence), pass them in
 * `existingAchievements` to preserve the `earnedAt` timestamp.
 */
export function evaluateAchievements(
  progress: UserProgress,
  existingAchievements: UserAchievement[] = []
): UserAchievement[] {
  const existingMap = new Map(existingAchievements.map((a) => [a.achievementId, a]));

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const existing = existingMap.get(def.id);

    // If already earned, preserve the earned state
    if (existing?.earned) return existing;

    // Evaluate all rules — ALL must pass for the achievement to be earned
    const results = def.rules.map((rule) => {
      const evaluator = RULE_EVALUATORS[rule.type];
      if (!evaluator) return { earned: false, progress: 0 };
      return evaluator(rule, progress);
    });

    const earned = results.every((r) => r.earned);
    // Progress = average of all rule progresses, capped at 100
    const progress_ = Math.min(
      100,
      Math.round(results.reduce((sum, r) => sum + r.progress, 0) / results.length)
    );

    return {
      achievementId: def.id,
      earned,
      earnedAt: earned ? new Date().toISOString() : undefined,
      progress: progress_,
    };
  });
}

/**
 * Returns achievement definitions paired with their current user state.
 * Useful for UI rendering.
 */
export function getAchievementsWithState(
  progress: UserProgress,
  existingAchievements: UserAchievement[] = []
) {
  const states = evaluateAchievements(progress, existingAchievements);
  const stateMap = new Map(states.map((s) => [s.achievementId, s]));

  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    definition: def,
    state: stateMap.get(def.id) ?? {
      achievementId: def.id,
      earned: false,
      progress: 0,
    },
  }));
}

/** Returns newly earned achievements by comparing before/after states. */
export function getNewlyEarnedAchievements(
  before: UserAchievement[],
  after: UserAchievement[]
): UserAchievement[] {
  const beforeEarned = new Set(before.filter((a) => a.earned).map((a) => a.achievementId));
  return after.filter((a) => a.earned && !beforeEarned.has(a.achievementId));
}

// ── Points Engine ─────────────────────────────────────────────────────────────

/** Create a points transaction for a given event. */
export function createPointsTransaction(
  userId: string,
  event: PointsEvent
): PointsTransaction {
  const base = getPointValue(event.type);
  const multiplier = event.multiplier ?? 1;
  return {
    id: `${userId}_${event.type}_${Date.now()}`,
    userId,
    event: event.type,
    points: Math.round(base * multiplier),
    createdAt: new Date().toISOString(),
    metadata: event.metadata,
  };
}

/** Apply a new transaction to the user's points state. */
export function applyTransaction(
  userPoints: UserPoints,
  transaction: PointsTransaction
): UserPoints {
  const now = new Date();
  const txDate = new Date(transaction.createdAt);
  const isCurrentWeek = isInCurrentWeek(txDate, now);
  const isCurrentMonth = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();

  return {
    ...userPoints,
    totalPoints: userPoints.totalPoints + transaction.points,
    weeklyPoints: isCurrentWeek ? userPoints.weeklyPoints + transaction.points : userPoints.weeklyPoints,
    monthlyPoints: isCurrentMonth ? userPoints.monthlyPoints + transaction.points : userPoints.monthlyPoints,
    transactions: [...userPoints.transactions, transaction],
  };
}

/** Create a default empty UserPoints for a new user. */
export function createEmptyPoints(userId: string): UserPoints {
  return {
    userId,
    totalPoints: 0,
    weeklyPoints: 0,
    monthlyPoints: 0,
    transactions: [],
  };
}

function isInCurrentWeek(date: Date, now: Date): boolean {
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return date >= monday;
}
