// lib/types/user-profile-kpi.ts

export type KPISource = "web" | "mobile" | "admin";

export interface UserProfileKPI {
  userId: string;

  firstName: string;
  lastName: string;
  email: string;

  region: string;
  level: string;
  businessStage: string;

  timestamp: string;

  source?: KPISource;
}
