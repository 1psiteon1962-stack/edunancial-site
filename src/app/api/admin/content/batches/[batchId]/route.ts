import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { deleteBatch } from "@/lib/admin-content/deletion";
import { assertValidEntityId } from "@/lib/admin-content/security";
import { getUploadBatch, updateBatchMetadata } from "@/lib/admin-content/service";

export async function GET(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  try {
    const { batchId } = await params;
    assertValidEntityId(batchId, "batch");
    const batch = await getUploadBatch(batchId);
    if (!batch) return Response.json({ error: "Batch not found" }, { status: 404 });
    return Response.json({ batch });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { batchId } = await params;
    assertValidEntityId(batchId, "batch");
    const body = await request.json().catch(() => null);
    if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    const batch = await updateBatchMetadata(batchId, toActor(auth.session), body);
    return Response.json({ batch });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { batchId } = await params;
    assertValidEntityId(batchId, "batch");
    const body = await request.json().catch(() => ({}));
    const allowExported = Boolean((body as { allowExported?: boolean }).allowExported);
    const result = await deleteBatch(batchId, toActor(auth.session), { allowExported });
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
