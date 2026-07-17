import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getExecutiveSnapshot } from "@/lib/executive/adapters";

export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;
  const snapshot = await getExecutiveSnapshot();
  return Response.json(snapshot);
}
