import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { getUploadBatch, updateBatchMetadata } from "@/lib/admin-content/service";

export async function GET(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  const batch = await getUploadBatch(batchId);
  if (!batch) return Response.json({ error: "Batch not found" }, { status: 404 });
  return Response.json({ batch });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  try {
    const batch = await updateBatchMetadata(batchId, toActor(auth.session), body);
    return Response.json({ batch });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
