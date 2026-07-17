import { redirect } from "next/navigation";

import { requireOwnerPageSession } from "@/lib/admin-content/auth";

export default async function ExecutivePage() {
  await requireOwnerPageSession();
  redirect("/executive/dashboard");
}

