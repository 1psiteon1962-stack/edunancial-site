import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getExportArchive } from "@/lib/admin-content/service";

export async function GET(request: Request, { params }: { params: Promise<{ batchId: string; exportId: string }> }) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  const { batchId, exportId } = await params;
  try {
    const archive = await getExportArchive(batchId, exportId);
    if (!archive) return Response.json({ error: "Archive not found" }, { status: 404 });
    return new Response(new Uint8Array(archive), { headers: { "content-type": "application/zip", "content-disposition": `attachment; filename="${exportId}.zip"` } });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
