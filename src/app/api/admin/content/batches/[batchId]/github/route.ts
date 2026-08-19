import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { exportBatchToGithub } from "@/lib/admin-content/service";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  await recordUploadOperation({ batchId, phase: "VERIFY", status: "STARTED", metadata: { operation: "github_export" } });
  try {
    const github = await exportBatchToGithub(batchId, toActor(auth.session));
    await recordUploadOperation({ batchId, phase: "VERIFY", status: "SUCCEEDED", metadata: { operation: "github_export", github } });
    return Response.json({ github });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "VERIFY", status: "FAILED", errorCode: err.name, errorMessage: err.message, metadata: { operation: "github_export" } });
    return Response.json({ error: err.message }, { status: 400 });
  }
}
