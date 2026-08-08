import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { clearWorkspace } from "@/lib/admin-content/deletion";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => null);
  const confirmation = String(body?.confirmation ?? "");

  try {
    const result = await clearWorkspace(toActor(auth.session), confirmation);
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
