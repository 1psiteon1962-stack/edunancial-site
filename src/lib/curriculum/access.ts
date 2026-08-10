/** Raw membership tier values from the auth system. */
export type CurriculumMembershipTier = "free" | "basic" | "premium" | "enterprise" | "beta";

/** Normalized curriculum tier used for access decisions. */
export type NormalizedCurriculumTier = "free" | "basic" | "pro" | "gold";

/**
 * Normalizes raw auth membership tier values to the canonical curriculum tier.
 *
 * Raw auth values → Curriculum tier:
 *   free      → free
 *   basic     → basic   (Basic Membership: L1 004–050, L2)
 *   beta      → basic   (Trial membership gets Basic access)
 *   premium   → pro     (Pro Membership: L3, L4)
 *   enterprise → gold   (Gold Membership: L5)
 */
export function normalizeToCurriculumTier(
  tier: string | null | undefined,
): NormalizedCurriculumTier {
  switch (tier) {
    case "basic": return "basic";
    case "beta": return "basic";
    case "premium": return "pro";
    case "enterprise": return "gold";
    default: return "free";
  }
}

/**
 * Returns the minimum normalized curriculum tier required to access a lesson.
 *
 * free:  Level 1, lessons 001–003 (public test drive)
 * basic: Level 1, lessons 004–050 and all Level 2 lessons
 * pro:   All Level 3 and Level 4 lessons
 * gold:  All Level 5 lessons
 */
export function getRequiredCurriculumTier(
  level: number,
  lessonNumber: number,
): NormalizedCurriculumTier {
  if (level === 1 && lessonNumber >= 1 && lessonNumber <= 3) return "free";
  if (level === 1 || level === 2) return "basic";
  if (level === 3 || level === 4) return "pro";
  return "gold";
}

const TIER_RANK: Record<NormalizedCurriculumTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  gold: 3,
};

export function isPublicCurriculumLesson(level: number, lessonNumber: number): boolean {
  return getRequiredCurriculumTier(level, lessonNumber) === "free";
}

export function hasCurriculumMembership(
  membershipTier: CurriculumMembershipTier | null | undefined,
): boolean {
  return normalizeToCurriculumTier(membershipTier) !== "free";
}

export function canAccessCurriculumLesson({
  level,
  lessonNumber,
  membershipTier,
  isAdmin = false,
}: {
  level: number;
  lessonNumber: number;
  membershipTier?: CurriculumMembershipTier | null;
  isAdmin?: boolean;
}): boolean {
  if (isAdmin) return true;
  const required = getRequiredCurriculumTier(level, lessonNumber);
  if (required === "free") return true;
  const effective = normalizeToCurriculumTier(membershipTier);
  return TIER_RANK[effective] >= TIER_RANK[required];
}
