import { UserProfile } from "../types/user-profile";

export function normalizeProfileForKPI(profile: UserProfile) {
  return {
    ageRange: profile.ageRange,
    hasBusiness: profile.hasBusiness,
    businessStatus: profile.businessStatus ?? "none",
    country: profile.country,
    createdAt: profile.createdAt,
  };
}
