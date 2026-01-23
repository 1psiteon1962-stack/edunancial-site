// app/admin/kpi/page.tsx

import { requireAdmin } from "@/lib/auth";

export default function AdminKpiPage() {
  // Works whether requireAdmin takes 0 or 1 argument
  requireAdmin();

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin KPI Dashboard</h1>
      <p>This page will display KPI records and reporting tools.</p>
    </div>
  );
}
