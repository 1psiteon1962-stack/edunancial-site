import { UserProfileKPI } from "./user-profile-kpi";
import { InvestorKPI } from "./investor-kpi";

export interface CanonicalKPIRecord {
  recordId: string; // UUID
  user: UserProfileKPI;
  investor: InvestorKPI;

  createdAt: string;
  source: "web" | "api" | "admin";
  version: 1;
}
