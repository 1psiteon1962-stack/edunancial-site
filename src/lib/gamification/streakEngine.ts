import type { UserStreaks, StreakRecord } from "./types";

// ─── Streak Engine ────────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD in local time. */
export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns yesterday's date as YYYY-MM-DD. */
function yesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Record a learning activity for today.
 * Returns an updated UserStreaks object — does NOT mutate the original.
 */
export function recordActivity(
  streaks: UserStreaks,
  lessonsCompletedToday = 1
): UserStreaks {
  const today = todayDate();
  const yesterday = yesterdayDate();

  // Determine if the streak continues
  const wasYesterday = streaks.lastActivityDate === yesterday;
  const isToday = streaks.lastActivityDate === today;

  let currentStreak = streaks.currentStreak;

  if (isToday) {
    // Already recorded today — just add to the daily lesson count
  } else if (wasYesterday) {
    currentStreak += 1;
  } else {
    // Gap in activity — reset streak
    currentStreak = 1;
  }

  const longestStreak = Math.max(streaks.longestStreak, currentStreak);

  // Update history
  const existingRecord = streaks.history.find((r) => r.date === today);
  const history: StreakRecord[] = existingRecord
    ? streaks.history.map((r) =>
        r.date === today
          ? { ...r, lessonsCompleted: r.lessonsCompleted + lessonsCompletedToday }
          : r
      )
    : [...streaks.history, { date: today, lessonsCompleted: lessonsCompletedToday }];

  return {
    ...streaks,
    currentStreak,
    longestStreak,
    lastActivityDate: today,
    weeklyActivity: buildWeeklyActivity(history),
    monthlyActivity: buildMonthlyActivity(history),
    history,
  };
}

/** Build a 7-element boolean array for Mon–Sun of the current calendar week. */
export function buildWeeklyActivity(history: StreakRecord[]): boolean[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  // Shift so Monday = index 0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const activityDates = new Set(history.map((r) => r.date));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return activityDates.has(d.toISOString().slice(0, 10));
  });
}

/** Build a boolean array for each day of the current calendar month. */
export function buildMonthlyActivity(history: StreakRecord[]): boolean[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activityDates = new Set(history.map((r) => r.date));

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const monthStr = String(month + 1).padStart(2, "0");
    return activityDates.has(`${year}-${monthStr}-${day}`);
  });
}

/** Create a default empty UserStreaks for a new user. */
export function createEmptyStreaks(userId: string): UserStreaks {
  return {
    userId,
    currentStreak: 0,
    longestStreak: 0,
    weeklyActivity: Array(7).fill(false),
    monthlyActivity: [],
    lastActivityDate: null,
    history: [],
  };
}

/** Returns the number of active days in the current week. */
export function weeklyActiveCount(streaks: UserStreaks): number {
  return streaks.weeklyActivity.filter(Boolean).length;
}

/** Returns the number of active days in the current month. */
export function monthlyActiveCount(streaks: UserStreaks): number {
  return streaks.monthlyActivity.filter(Boolean).length;
}
