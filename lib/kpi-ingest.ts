import { UserProfileKPI } from "@/lib/types/user-profile-kpi";

export function ingestKPI(
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
    businessType: input.businessType,

    businessStage: input.businessStage ?? "unspecified",
    timestamp: new Date().toISOString(),
  };
}
