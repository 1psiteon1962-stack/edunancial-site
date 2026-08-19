import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { getExecutiveOperationsSnapshot } from "@/lib/admin/operations-snapshot";

export const metadata = { title: "Executive Dashboard | Edunancial Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPageSession();
  const snapshot = await getExecutiveOperationsSnapshot();
  return <AdminDashboardClient snapshot={snapshot} />;
}
