import { requireAdminPageSession } from "@/lib/admin-content/auth";
import ContentDashboardClient from "@/components/admin-content/ContentDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdminPageSession();
  return <ContentDashboardClient />;
}
