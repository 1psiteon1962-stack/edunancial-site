import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listMedia } from "@/lib/admin-content/course-storage";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const media = await listMedia();
  return Response.json({ media });
}
