// lib/discipline-store.ts

import { create } from "zustand";

/**
 * Discipline metrics tracked per user session.
 * This store is intentionally simple and deterministic.
 */

export type DisciplineState = {
  streakDays: number;
  lastActionDate: string | null;
  incrementStreak: () => void;
  resetStreak: () => void;
};

export const useDisciplineStore = create<DisciplineState>((set, get) => ({
  streakDays: 0,
  lastActionDate: null,

  incrementStreak: () => {
    const today = new Date().toISOString().slice(0, 10);
    const { lastActionDate, streakDays } = get();

    if (lastActionDate === today) return;

    set({
      streakDays: streakDays + 1,
      lastActionDate: today,
    });
  },

  resetStreak: () =>
    set({
      streakDays: 0,
      lastActionDate: null,
    }),
}));
