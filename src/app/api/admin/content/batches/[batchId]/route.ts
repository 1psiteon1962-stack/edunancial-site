import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { deleteBatch } from "@/lib/admin-content/deletion";
import { assertValidEntityId } from "@/lib/admin-content/security";
import { getUploadBatch, updateBatchMetadata } from "@/lib/admin-content/service";
import { receiptMatchesBatch, summarizePublicationStatus } from "@/lib/admin-content/publication-status";
import { getUploadReceipt } from "@/lib/admin-content/upload-receipts";

export async function GET(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  try {
    const { batchId } = await params;
    assertValidEntityId(batchId, "batch");
    const batch = await getUploadBatch(batchId);
    if (!batch) return Response.json({ error: "Batch not found" }, { status: 404 });
    let receipt = batch.source?.startsWith("Recovered from stored upload batch ")
      ? await getUploadReceipt(batch.source.replace("Recovered from stored upload batch ", "").trim())
      : null;
    if (!receipt) {
      // Fresh uploads: the receipt is keyed by upload ID and points back to this review batch.
      const uploadIds = [...new Set(batch.files.map((file) => file.uploadId).filter(Boolean))].slice(0, 5);
      for (const uploadId of uploadIds) {
        const candidate = await getUploadReceipt(uploadId);
        if (receiptMatchesBatch(candidate, batch.id)) { receipt = candidate; break; }
      }
    }
    return Response.json({ batch, publicationReceipt: receipt, publicationStatus: summarizePublicationStatus(receipt) });
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
