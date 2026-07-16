import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { exportBatch } from "@/lib/admin-content/service";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  try {
    const exportPackage = await exportBatch(batchId, toActor(auth.session));
    return Response.json({ exportPackage, downloadUrl: `/api/admin/content/batches/${batchId}/exports/${exportPackage.id}` });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
