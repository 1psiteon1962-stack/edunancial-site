import MaintenanceClient from "@/components/admin-content/MaintenanceClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const dynamic = "force-dynamic";

export default async function AdminContentMaintenancePage() {
  await requireAdminPageSession();
  return <MaintenanceClient />;
}
