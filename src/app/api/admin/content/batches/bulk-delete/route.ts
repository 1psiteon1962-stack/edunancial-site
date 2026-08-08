import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { bulkDeleteBatches } from "@/lib/admin-content/deletion";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.batchIds)) {
    return Response.json({ error: "batchIds array is required." }, { status: 400 });
  }

  const batchIds = body.batchIds.map((entry: unknown) => String(entry));
  const allowExported = Boolean(body.allowExported);

  try {
    const result = await bulkDeleteBatches(batchIds, toActor(auth.session), { allowExported });
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
