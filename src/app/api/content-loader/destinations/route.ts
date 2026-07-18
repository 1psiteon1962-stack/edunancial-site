import { requireContentLoaderApiSession } from "@/lib/content-loader/auth";
import { listContentLoaderDestinations } from "@/lib/content-loader/service";

export async function GET(request: Request) {
  const auth = await requireContentLoaderApiSession(request);
  if (!auth.ok) {
    return auth.response;
  }
  const destinations = await listContentLoaderDestinations();
  return Response.json({ destinations });
}
