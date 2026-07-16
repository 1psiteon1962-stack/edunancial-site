import { clearAdminSession, createAuditEvent, getAdminSession, requireAdminApiSession } from "@/lib/admin-content/auth";
import { appendGlobalAuditEvent } from "@/lib/admin-content/audit";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const session = await getAdminSession();
  await clearAdminSession();
  await appendGlobalAuditEvent(createAuditEvent({ action: "logout", result: "success", actor: session?.email ?? auth.session.email }));
  return Response.json({ ok: true });
}
