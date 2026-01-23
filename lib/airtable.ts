import { UserProfileKPI, KPISource } from "@/lib/types/user-profile-kpi";

export function buildKPIRecord(
  data: UserProfileKPI,
  source: KPISource = "web"
) {
  return {
    fields: {
      UserId: data.userId,
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,

      Region: data.region,
      Level: data.level,
      BusinessStage: data.businessStage,

      Timestamp: data.timestamp,
      Source: source
    }
  };
}
