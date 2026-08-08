import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { deleteWorkspaceOrphans, scanWorkspaceOrphans } from "@/lib/admin-content/deletion";
import { assertSafeWorkspacePath } from "@/lib/admin-content/security";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  try {
    const result = await scanWorkspaceOrphans(toActor(auth.session));
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.paths)) {
      return Response.json({ error: "paths array is required." }, { status: 400 });
    }
    const paths = body.paths.map((entry: unknown) => assertSafeWorkspacePath(String(entry)));
    const result = await deleteWorkspaceOrphans(paths, toActor(auth.session));
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
