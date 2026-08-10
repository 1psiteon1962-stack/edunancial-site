export type CurriculumMembershipTier = "free" | "basic" | "premium" | "enterprise" | "beta";

export function isPublicCurriculumLesson(level: number, lessonNumber: number): boolean {
  return level === 1 && lessonNumber >= 1 && lessonNumber <= 3;
}

export function hasCurriculumMembership(
  membershipTier: CurriculumMembershipTier | null | undefined,
): boolean {
  return membershipTier === "basic"
    || membershipTier === "premium"
    || membershipTier === "enterprise"
    || membershipTier === "beta";
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
  return isAdmin
    || isPublicCurriculumLesson(level, lessonNumber)
    || hasCurriculumMembership(membershipTier);
}
