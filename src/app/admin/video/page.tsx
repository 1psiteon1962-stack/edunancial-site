import { redirect } from "next/navigation";

import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function LegacyAdminVideoPage() {
  await requireAdminPageSession();
  redirect("/admin/video-studio");
}
