import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import {
  repairAndPublishLocalizedBatch,
  restoreCanonicalLessonsAfterLocalizedPublish,
} from "@/lib/admin-content/localized-batch-repair";
import { publishBatch } from "@/lib/admin-content/service";
import { PublicationBusyError, assertLeaseFresh, withPublicationLease } from "@/lib/admin-content/publication-lock";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const { batchId } = await params;
  await recordUploadOperation({ batchId, phase: "PUBLISH", status: "STARTED" });
  try {
    const { result, canonicalRestore, localization } = await withPublicationLease(`publish:${batchId}`, async (lease) => {
      const result = await publishBatch(batchId, toActor(auth.session));
      assertLeaseFresh(lease);
      const canonicalRestore = await restoreCanonicalLessonsAfterLocalizedPublish(result.batch);
      assertLeaseFresh(lease);
      const localization = await repairAndPublishLocalizedBatch(result.batch);
      assertLeaseFresh(lease);
      return { result, canonicalRestore, localization };
    });
    await recordUploadOperation({
      batchId,
      phase: "PUBLISH",
      status: "SUCCEEDED",
      metadata: { github: result.github ?? null, canonicalRestore, localization },
    });
    return Response.json({ batch: result.batch, github: result.github, canonicalRestore, localization });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "PUBLISH", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    if (err instanceof PublicationBusyError) {
      return Response.json({ error: err.message, retryAfterMs: err.retryAfterMs }, { status: 409 });
    }
    return Response.json({ error: err.message }, { status: 400 });
  }
}