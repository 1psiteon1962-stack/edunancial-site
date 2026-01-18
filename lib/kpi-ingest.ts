import type { UserProfileKPI } from "./types/user-profile-kpi";

/**
 * Canonical normalization layer.
 * This is the ONLY place raw input becomes a valid KPI user object.
 */
export function normalizeUserKPI(
  input: Partial<UserProfileKPI>
): UserProfileKPI {
  return {
    userId: input.userId ?? "anonymous",
    createdAt: input.createdAt ?? new Date().toISOString(),

    firstName: input.firstName ?? "",
    lastName: input.lastName ?? "",
    email: input.email ?? "",

    phone: input.phone,
    address: input.address,

    region: input.region ?? "unknown",
    level: input.level ?? "unassigned",

    businessName: input.businessName,
    businessJurisdiction: input.businessJurisdiction,
    businessType: input.businessType ?? "informal",
    businessStage: input.businessStage ?? "unspecified",

    timestamp: new Date().toISOString(),
  };
}
