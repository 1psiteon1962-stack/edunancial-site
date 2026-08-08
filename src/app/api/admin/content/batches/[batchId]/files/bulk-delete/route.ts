import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { bulkDeleteBatchFiles } from "@/lib/admin-content/deletion";
import { assertValidEntityId } from "@/lib/admin-content/security";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { batchId } = await params;
    assertValidEntityId(batchId, "batch");
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.fileIds)) {
      return Response.json({ error: "fileIds array is required." }, { status: 400 });
    }
    const fileIds = body.fileIds.map((entry: unknown) => String(entry));
    const result = await bulkDeleteBatchFiles(batchId, fileIds, toActor(auth.session));
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
