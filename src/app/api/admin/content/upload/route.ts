import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatch } from "@/lib/admin-content/service";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const formData = await request.formData();
    const batch = await createUploadBatch(request, toActor(auth.session), formData);
    return Response.json({ success: true, batch }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    const body: Record<string, unknown> = {
      success: false,
      error: err.message ?? "Upload failed.",
      reason: err.name ?? "UnknownError",
      status: 400,
    };
    if (process.env.NODE_ENV !== "production") {
      body.stack = err.stack;
    }
    return Response.json(body, { status: 400 });
  }
}
