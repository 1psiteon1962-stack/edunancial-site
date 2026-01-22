// Canonical KPI type (preferred internal name)
export interface UserProfileKpi {
  userId: string;
  createdAt: string;

  firstName: string;
  lastName: string;
  email: string;

  region: string;
  level: string;
  businessStage: string;
}

// Compatibility alias — DO NOT REMOVE
// Required because app/admin/kpi/page.tsx imports `UserProfileKPI`
export type UserProfileKPI = UserProfileKpi;
