import { clearAdminSession } from "@/lib/admin-content/auth";

export async function POST() {
  await clearAdminSession();
  return Response.json({ ok: true });
}
