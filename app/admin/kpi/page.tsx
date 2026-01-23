// app/admin/kpi/page.tsx

import { requireAdmin } from "@/lib/auth/require-admin";
import { UserProfileKPI } from "@/lib/types/user-profile-kpi";

const mockData: UserProfileKPI[] = [
  {
    userId: "sample",
    firstName: "Sample",
    lastName: "User",
    email: "sample@example.com",
    region: "us",
    level: "level-2",
    businessStage: "early",
    timestamp: new Date().toISOString(),
    source: "admin",
  },
];

export default function AdminKpiPage() {
  requireAdmin();

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin KPI Dashboard</h1>

      <pre>{JSON.stringify(mockData, null, 2)}</pre>
    </div>
  );
}
