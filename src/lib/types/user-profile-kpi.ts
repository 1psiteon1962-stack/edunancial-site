// Canonical KPI type (internal)
export interface UserProfileKpi {
  userId: string;

  firstName: string;
  lastName: string;
  email: string;

  region: string;
  level: string;
  businessStage: string;

  // Time metadata used by admin KPI UI
  createdAt: string;
  timestamp: string;
}

// Compatibility alias — REQUIRED
// app/admin/kpi/page.tsx imports UserProfileKPI
export type UserProfileKPI = UserProfileKpi;
