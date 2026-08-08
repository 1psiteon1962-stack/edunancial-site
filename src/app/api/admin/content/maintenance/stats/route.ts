import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getWorkspaceMaintenanceStats } from "@/lib/admin-content/deletion";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  try {
    const stats = await getWorkspaceMaintenanceStats();
    return Response.json({ ok: true, stats });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
