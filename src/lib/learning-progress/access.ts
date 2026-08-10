import { canAccessCurriculumLesson } from "@/lib/curriculum/access";

import type { AccessTierAtRecord } from "./types";

export type AppMembershipTier = "free" | "basic" | "premium" | "enterprise" | "beta";

export interface LearningProgressCurrentUser {
  id: string;
  membershipTier: AppMembershipTier;
  isAdmin?: boolean;
}

export function normalizeMembershipToAccessTier(
  membershipTier: AppMembershipTier,
  isAdmin = false,
): AccessTierAtRecord {
  if (isAdmin) return "admin";

  switch (membershipTier) {
    case "basic":
      return "basic";
    case "premium":
      return "pro";
    case "enterprise":
      return "gold";
    case "beta":
      // Existing repo convention treats beta as basic access.
      return "basic";
    default:
      return "free";
  }
}

export function canRecordLessonProgressForTier({
  level,
  lessonNumber,
  membershipTier,
  isAdmin,
}: {
  level: number;
  lessonNumber: number;
  membershipTier: AppMembershipTier;
  isAdmin?: boolean;
}): boolean {
  return canAccessCurriculumLesson({
    level,
    lessonNumber,
    membershipTier,
    isAdmin,
  });
}
