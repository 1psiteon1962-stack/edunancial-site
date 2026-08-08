import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { deleteFailedBatches } from "@/lib/admin-content/deletion";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const result = await deleteFailedBatches(toActor(auth.session));
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
