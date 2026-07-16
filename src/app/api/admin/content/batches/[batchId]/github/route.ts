import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { exportBatchToGithub } from "@/lib/admin-content/service";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  try {
    const github = await exportBatchToGithub(batchId, toActor(auth.session));
    return Response.json({ github });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
