import { requireAdmin } from "@/lib/auth/require-admin";
import { UserProfileKPI } from "@/lib/types/user-profile-kpi";

const mockData: UserProfileKPI[] = [
  {
    userId: "sample",
    createdAt: new Date().toISOString(),
    firstName: "Sample",
    lastName: "User",
    email: "sample@example.com",
    region: "us",
    level: "level-2",
    businessStage: "early",
    timestamp: new Date().toISOString(),
  },
];

export default function AdminKpiPage() {
  const isAdmin = false; // replace later with real auth
  requireAdmin(isAdmin);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin KPI View</h1>
      <pre>{JSON.stringify(mockData, null, 2)}</pre>
    </div>
  );
}
