import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { deleteBatchFile } from "@/lib/admin-content/deletion";
import { assertValidEntityId } from "@/lib/admin-content/security";
import { updateBatchFile } from "@/lib/admin-content/service";

export async function PATCH(request: Request, { params }: { params: Promise<{ batchId: string; fileId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    const { batchId, fileId } = await params;
    assertValidEntityId(batchId, "batch");
    assertValidEntityId(fileId, "file");
    const file = await updateBatchFile(batchId, fileId, toActor(auth.session), body);
    return Response.json({ file });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ batchId: string; fileId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { batchId, fileId } = await params;
    assertValidEntityId(batchId, "batch");
    assertValidEntityId(fileId, "file");
    const result = await deleteBatchFile(batchId, fileId, toActor(auth.session));
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
