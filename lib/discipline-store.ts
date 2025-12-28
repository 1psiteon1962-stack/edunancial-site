// lib/discipline-store.ts

/**
 * Simple in-memory discipline store.
 * No external dependencies.
 * Safe for Next.js + Netlify builds.
 *
 * NOTE:
 * This is intentionally stateless across server restarts.
 * If persistence is required later, this can be swapped for
 * localStorage or a backend store without changing the API.
 */

export type DisciplineState = {
  streakDays: number;
  lastActionDate: string | null;
};

let state: DisciplineState = {
  streakDays: 0,
  lastActionDate: null,
};

export function getDisciplineState(): DisciplineState {
  return { ...state };
}

export function incrementStreak(): void {
  const today = new Date().toISOString().slice(0, 10);

  if (state.lastActionDate === today) return;

  state = {
    streakDays: state.streakDays + 1,
    lastActionDate: today,
  };
}

export function resetStreak(): void {
  state = {
    streakDays: 0,
    lastActionDate: null,
  };
}
