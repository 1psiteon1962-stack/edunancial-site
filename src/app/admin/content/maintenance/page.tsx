import MaintenanceClient from "@/components/admin-content/MaintenanceClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function AdminContentMaintenancePage() {
  await requireAdminPageSession();
  return <MaintenanceClient />;
}
