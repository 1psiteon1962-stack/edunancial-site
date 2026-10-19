import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { cancelMarketingPublication } from "@/lib/marketing/control-plane";

export async function POST(request: Request, { params }: { params: Promise<{ publicationId: string }> }) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { publicationId } = await params;
    return Response.json(await cancelMarketingPublication(publicationId, auth.session.email));
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Rejection failed." }, { status: 400 });
  }
}
