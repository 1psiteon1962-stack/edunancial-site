import { redirect } from "next/navigation";

import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function AdminPortal() {
  await requireAdminPageSession();
  redirect("/admin/content");
}
