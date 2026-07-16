import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listUploadBatches } from "@/lib/admin-content/service";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  return Response.json({ batches: await listUploadBatches() });
}
