import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { repairAndPublishLocalizedBatch } from "@/lib/admin-content/localized-batch-repair";
import { publishBatch } from "@/lib/admin-content/service";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  await recordUploadOperation({ batchId, phase: "PUBLISH", status: "STARTED" });
  try {
    const result = await publishBatch(batchId, toActor(auth.session));
    const localization = await repairAndPublishLocalizedBatch(result.batch);
    await recordUploadOperation({ batchId, phase: "PUBLISH", status: "SUCCEEDED", metadata: { github: result.github ?? null, localization } });
    return Response.json({ batch: result.batch, github: result.github, localization });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "PUBLISH", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    return Response.json({ error: err.message }, { status: 400 });
  }
}
