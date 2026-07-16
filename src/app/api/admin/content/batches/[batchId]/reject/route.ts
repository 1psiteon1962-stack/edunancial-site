import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { bulkReview } from "@/lib/admin-content/service";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => null);
  if (!body?.fileIds || !Array.isArray(body.fileIds)) return Response.json({ error: "fileIds array is required" }, { status: 400 });
  const { batchId } = await params;
  const batch = await bulkReview(batchId, toActor(auth.session), body.fileIds, "rejected");
  return Response.json({ batch });
}
