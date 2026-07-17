import { redirect } from "next/navigation";

import { requireOwnerPageSession } from "@/lib/admin-content/auth";

export const dynamic = "force-dynamic";

// This page redirects to the API CSV export endpoint after validating the session.
export default async function ExecutiveKPIExportPage() {
  await requireOwnerPageSession();
  redirect("/api/executive/kpi/export");
}
