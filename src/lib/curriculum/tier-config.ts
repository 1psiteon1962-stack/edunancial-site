/**
 * Curriculum Tier Configuration
 *
 * Loads and caches the admin-editable tier→level mapping from
 * curriculum/tier-config.json.  Changes to that file take effect
 * immediately without a code deploy.
 *
 * Tier hierarchy (cumulative / strictly additive):
 *   free  → free preview only (Level 1, lessons 001–003)
 *   basic → Level 1 + Level 2 (plus free preview)
 *   pro   → Levels 1–4 (plus all basic content)
 *   gold  → Levels 1–5 (plus all pro content)
 *   admin → bypasses all gating
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CurriculumTier = "free" | "basic" | "pro" | "gold";

export interface TierLevelConfig {
  version: string;
  updatedAt: string;
  updatedBy: string;
  description?: string;
  freePreview: {
    level: number;
    maxLesson: number;
    note?: string;
  };
  /** Maps tier name → array of unlocked level numbers */
  mapping: Record<string, number[]>;
}

const CONFIG_PATH = join(process.cwd(), "curriculum", "tier-config.json");

const DEFAULT_CONFIG: TierLevelConfig = {
  version: "1.0",
  updatedAt: new Date().toISOString(),
  updatedBy: "system",
  freePreview: { level: 1, maxLesson: 3 },
  mapping: {
    basic: [1, 2],
    pro: [1, 2, 3, 4],
    gold: [1, 2, 3, 4, 5],
  },
};

let _cachedConfig: TierLevelConfig | null = null;

// ---------------------------------------------------------------------------
// Config loader
// ---------------------------------------------------------------------------

export function readTierConfig(): TierLevelConfig {
  if (_cachedConfig) return _cachedConfig;
  if (!existsSync(CONFIG_PATH)) return DEFAULT_CONFIG;
  try {
    _cachedConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as TierLevelConfig;
    return _cachedConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function invalidateTierConfigCache(): void {
  _cachedConfig = null;
}

// ---------------------------------------------------------------------------
// Access gate helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the viewer (given their membership tier) can read the
 * full body of a lesson identified by its level and lesson number.
 *
 * Gate order (matches Part C spec):
 * 1. Admin → always allowed.
 * 2. Level 1 lessons 001–003 → free preview; any viewer allowed.
 * 3. Otherwise → check tier config mapping.
 */
export function canAccessLesson(
  lessonLevel: number,
  lessonNumber: number,
  viewerTier: CurriculumTier | "admin",
): boolean {
  if (viewerTier === "admin") return true;

  const config = readTierConfig();
  const fp = config.freePreview;

  // Free preview: Level 1, lessons 001–003 (configurable via tier-config.json)
  if (lessonLevel === fp.level && lessonNumber <= fp.maxLesson) return true;

  // No membership
  if (viewerTier === "free") return false;

  const unlockedLevels: number[] = config.mapping[viewerTier] ?? [];
  return unlockedLevels.includes(lessonLevel);
}

/**
 * Returns the minimum tier required to access a given level, or null if
 * the level falls within the free preview.
 */
export function getRequiredTierForLevel(
  lessonLevel: number,
  lessonNumber: number,
): { tier: CurriculumTier; label: string } | null {
  const config = readTierConfig();
  const fp = config.freePreview;

  if (lessonLevel === fp.level && lessonNumber <= fp.maxLesson) return null;

  // Find the lowest tier that unlocks this level
  const tierOrder: CurriculumTier[] = ["basic", "pro", "gold"];
  for (const tier of tierOrder) {
    const levels: number[] = config.mapping[tier] ?? [];
    if (levels.includes(lessonLevel)) {
      return { tier, label: TIER_LABELS[tier] };
    }
  }
  // Level not covered by any tier
  return { tier: "gold", label: TIER_LABELS.gold };
}

/** Human-readable display labels for each tier */
export const TIER_LABELS: Record<CurriculumTier | "admin", string> = {
  free: "Free Preview",
  basic: "Basic Membership",
  pro: "Pro Membership",
  gold: "Gold Membership",
  admin: "Administrator",
};

/**
 * Returns a human-readable description of which tier is required to access
 * a lesson, suitable for displaying on a locked lesson page.
 * e.g. "This lesson is part of Level 3, available with Pro Membership or higher."
 */
export function getLockedLessonMessage(lessonLevel: number): string {
  const config = readTierConfig();
  const tierOrder: CurriculumTier[] = ["basic", "pro", "gold"];
  for (const tier of tierOrder) {
    const levels: number[] = config.mapping[tier] ?? [];
    if (levels.includes(lessonLevel)) {
      return `This lesson is part of Level ${lessonLevel}, available with ${TIER_LABELS[tier]} or higher.`;
    }
  }
  return `This lesson is part of Level ${lessonLevel} and requires a membership to access.`;
}

/**
 * Returns the tier name (for URL routing to pricing page with pre-highlighted tier)
 * for a given level.
 */
export function getPricingTierParam(lessonLevel: number): string | null {
  const required = getRequiredTierForLevel(lessonLevel, 999);
  return required?.tier ?? null;
}

/**
 * Returns a summary of all tiers and their unlocked levels, for display in
 * the admin tier config UI.
 */
export function getTierSummary(): Array<{
  tier: CurriculumTier;
  label: string;
  unlockedLevels: number[];
}> {
  const config = readTierConfig();
  const tierOrder: CurriculumTier[] = ["basic", "pro", "gold"];
  return tierOrder.map((tier) => ({
    tier,
    label: TIER_LABELS[tier],
    unlockedLevels: config.mapping[tier] ?? [],
  }));
}
