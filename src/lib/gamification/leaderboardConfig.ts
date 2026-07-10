import type { LeaderboardConfig, LeaderboardScope } from "./types";

// ─── Leaderboard Configuration ────────────────────────────────────────────────
//
// All leaderboard scopes can be toggled on/off via the `enabled` flag.
// This keeps the feature configurable without code changes.

export const LEADERBOARD_CONFIGS: Record<LeaderboardScope, LeaderboardConfig> = {
  global: {
    enabled: true,
    scope: "global",
    maxEntries: 100,
    refreshIntervalMinutes: 60,
  },
  monthly: {
    enabled: true,
    scope: "monthly",
    maxEntries: 50,
    refreshIntervalMinutes: 60,
  },
  all_time: {
    enabled: true,
    scope: "all_time",
    maxEntries: 100,
    refreshIntervalMinutes: 1440, // daily
  },
  organization: {
    enabled: false, // future-ready: enabled when org feature is live
    scope: "organization",
    maxEntries: 50,
    refreshIntervalMinutes: 30,
  },
  friends: {
    enabled: false, // future-ready: enabled when social features are live
    scope: "friends",
    maxEntries: 20,
    refreshIntervalMinutes: 15,
  },
};

/** Returns only the leaderboard configs that are currently enabled. */
export function getActiveLeaderboards(): LeaderboardConfig[] {
  return Object.values(LEADERBOARD_CONFIGS).filter((c) => c.enabled);
}

/** Human-readable labels for each scope. */
export const LEADERBOARD_SCOPE_LABELS: Record<LeaderboardScope, string> = {
  global: "Global",
  monthly: "This Month",
  all_time: "All-Time",
  organization: "Organization",
  friends: "Friends",
};
