/**
 * Curriculum Academy Configuration
 *
 * Defines the canonical multi-academy structure for the Edunancial curriculum.
 * RED, WHITE, and BLUE are the three primary academies, each with five levels.
 *
 * Adding a new academy requires only adding an entry here — no other code changes.
 * Adding new lessons requires only adding lesson files; they appear automatically.
 */

// ---------------------------------------------------------------------------
// Membership tiers
// ---------------------------------------------------------------------------

/**
 * Ordered membership tiers used for catalog visibility filtering.
 * "admin" is a special override that bypasses all visibility rules server-side.
 *
 * Note: Full lesson body access is governed by the admin-editable tier→level
 * mapping in curriculum/tier-config.json (see src/lib/curriculum/tier-config.ts).
 */
export type MembershipTier = "free" | "basic" | "pro" | "gold";

/** All tiers a given tier can access (including its own tier). */
const TIER_ACCESS: Record<MembershipTier, Set<MembershipTier>> = {
  free:  new Set(["free"]),
  basic: new Set(["free", "basic"]),
  pro:   new Set(["free", "basic", "pro"]),
  gold:  new Set(["free", "basic", "pro", "gold"]),
};

/**
 * Returns true when `lesson` is visible in the catalog to `viewer`.
 *
 * This governs catalog listing visibility only. Full lesson body access is
 * governed separately by canAccessLesson() in tier-config.ts.
 *
 * @param lessonTier  - The membership tier recorded on the lesson (defaults to "free" when absent).
 * @param viewer      - The viewer's tier, or "admin" to bypass all restrictions.
 */
export function isLessonVisible(
  lessonTier: string | undefined,
  viewer: MembershipTier | "admin",
): boolean {
  if (viewer === "admin") return true;
  const raw = (lessonTier ?? "free").toLowerCase();
  // Map legacy tier names to the current naming convention
  const normalised = (
    raw === "standard" ? "pro" :
    raw === "premium" ? "gold" :
    raw
  ) as MembershipTier;
  return TIER_ACCESS[viewer]?.has(normalised) ?? false;
}

// ---------------------------------------------------------------------------
// Academy definitions
// ---------------------------------------------------------------------------

export interface AcademyDefinition {
  /** Short uppercase code matching the curriculum track code */
  code: string;
  /** Full display name */
  name: string;
  /** Short marketing description shown on academy cards */
  description: string;
  /** Total number of levels in this academy */
  levelCount: number;
}

/**
 * Canonical list of primary Edunancial academies.
 *
 * Add future academies here when they are ready.  Everything else (routing,
 * static params, landing cards) is derived automatically.
 */
export const ACADEMIES: AcademyDefinition[] = [
  {
    code: "RED",
    name: "Real Estate",
    description:
      "Master real estate as an asset class — residential, commercial, income generation, financing, and long-term wealth building.",
    levelCount: 5,
  },
  {
    code: "WHITE",
    name: "Paper Assets",
    description:
      "Understand stocks, bonds, funds, and other financial instruments — how they work, how they generate returns, and how to evaluate them.",
    levelCount: 5,
  },
  {
    code: "BLUE",
    name: "Business",
    description:
      "Build business competency — business models, cash flow, operations, growth strategies, and the financial mechanics of entrepreneurship.",
    levelCount: 5,
  },
];

/** Quick lookup map from academy code → definition */
export const ACADEMY_MAP: ReadonlyMap<string, AcademyDefinition> = new Map(
  ACADEMIES.map((a) => [a.code, a]),
);

/**
 * Returns all level numbers for an academy (always 1 … levelCount).
 * Use this instead of deriving levels from the registry to guarantee
 * that all levels appear even when no lessons exist yet.
 */
export function academyLevels(academy: AcademyDefinition): number[] {
  return Array.from({ length: academy.levelCount }, (_, i) => i + 1);
}
