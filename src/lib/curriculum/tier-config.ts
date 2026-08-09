/**
 * Curriculum Tier Configuration
 *
 * Loads and caches the admin-editable tier→level mapping from
 * curriculum/tier-config.json.  Changes to that file take effect
 * immediately without a code deploy.
 *
 * Tier hierarchy (cumulative / strictly additive):
 *   test-drive → only explicitly designated sample lessons (any level)
 *   basic      → Levels 1–2
 *   pro        → Levels 1–4 (includes all basic content)
 *   gold       → Levels 1–5 (includes all pro content)
 *   admin      → bypasses all gating
 *
 * Test Drive is NOT Level 0. A sample lesson can come from any level.
 * Test Drive provides access only to lessons explicitly marked isSample.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { translate } from "@/lib/international/i18n";

// ---------------------------------------------------------------------------
// Canonical curriculum level titles (single source of truth)
// ---------------------------------------------------------------------------

/**
 * Official five-level curriculum progression titles.
 * These are the authoritative English titles; locale files provide translations.
 * Internal identifiers (level numbers 1–5) are language-neutral.
 */
export const CURRICULUM_LEVEL_TITLES: Record<number, string> = {
  1: "Financial Literacy",
  2: "Financial Competency",
  3: "Financial Application",
  4: "Financial Strategy",
  5: "Financial Mastery",
} as const;

/** Returns the canonical display title for a curriculum level number (1–5). */
export function getLevelTitle(level: number): string {
  return CURRICULUM_LEVEL_TITLES[level] ?? `Level ${level}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CurriculumTier = "free" | "test-drive" | "basic" | "pro" | "gold";

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
  /**
   * Lesson IDs that are explicitly designated as Test Drive / sample lessons.
   * A sample lesson can come from any level. Test Drive members may only access
   * lessons in this list — not the entire level they belong to.
   */
  sampleLessons?: string[];
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
  sampleLessons: [],
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
 * Gate order:
 * 1. Admin → always allowed.
 * 2. Test Drive → only sample lessons explicitly listed in sampleLessons[].
 * 3. Level 1 lessons 001–003 → free preview; any viewer allowed (backward compat).
 * 4. Otherwise → check tier config mapping.
 *
 * @param lessonLevel   - The lesson's curriculum level (1–5).
 * @param lessonNumber  - The lesson's number within the level.
 * @param viewerTier    - The viewer's effective membership tier.
 * @param lessonId      - Optional lesson ID (e.g. "RED-L1-001") for Test Drive check.
 */
export function canAccessLesson(
  lessonLevel: number,
  lessonNumber: number,
  viewerTier: CurriculumTier | "admin",
  lessonId?: string,
): boolean {
  if (viewerTier === "admin") return true;

  const config = readTierConfig();

  // Test Drive: only sample lessons (from any level) — never the whole level
  if (viewerTier === "test-drive") {
    if (!lessonId) return false;
    const sampleLessons = config.sampleLessons ?? [];
    return sampleLessons.includes(lessonId);
  }

  const fp = config.freePreview;

  // Free preview: Level 1, lessons 001–003 (configurable via tier-config.json)
  if (lessonLevel === fp.level && lessonNumber <= fp.maxLesson) return true;

  // No membership (unauthenticated / free)
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
  "test-drive": "Test Drive",
  basic: "Basic Membership",
  pro: "Pro Membership",
  gold: "Gold Membership",
  admin: "Administrator",
};

/**
 * Returns true if the given lesson ID is designated as a Test Drive sample lesson.
 */
export function isSampleLesson(lessonId: string): boolean {
  const config = readTierConfig();
  return (config.sampleLessons ?? []).includes(lessonId);
}

/**
 * Returns all lesson IDs currently designated as Test Drive sample lessons.
 */
export function getSampleLessons(): string[] {
  const config = readTierConfig();
  return config.sampleLessons ?? [];
}

/**
 * Returns a human-readable description of which tier is required to access
 * a lesson, suitable for displaying on a locked lesson page.
 * e.g. "This lesson is part of Level 3, available with Pro Membership or higher."
 */
export function getLockedLessonMessage(
  lessonLevel: number,
  languageCode = "en-US",
): string {
  const config = readTierConfig();
  const tierOrder: CurriculumTier[] = ["basic", "pro", "gold"];
  for (const tier of tierOrder) {
    const levels: number[] = config.mapping[tier] ?? [];
    if (levels.includes(lessonLevel)) {
      return translate(languageCode, "curriculumLesson.lockedRequiresTier", {
        level: lessonLevel,
        tier: translate(languageCode, `membership.tier.${tier}`),
      });
    }
  }
  return translate(languageCode, "curriculumLesson.lockedRequiresMembership", {
    level: lessonLevel,
  });
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
