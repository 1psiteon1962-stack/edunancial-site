import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatch } from "@/lib/admin-content/service";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const formData = await request.formData();
    const batch = await createUploadBatch(request, toActor(auth.session), formData);
    return Response.json({ batch }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
