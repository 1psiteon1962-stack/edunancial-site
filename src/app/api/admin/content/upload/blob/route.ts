import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { assertValidUploadName, validateFileSize } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const storagePath = request.nextUrl.searchParams.get("path")?.trim() ?? "";
    const filename = request.nextUrl.searchParams.get("name")?.trim() ?? "";
    if (!storagePath.startsWith("uploads/") || storagePath.includes("..")) throw new Error("Invalid upload storage path.");
    assertValidUploadName(filename);
    const buffer = Buffer.from(await request.arrayBuffer());
    validateFileSize(buffer.length);
    await getAdminContentStorage().saveBinary(storagePath, buffer, request.headers.get("content-type") || "application/octet-stream");
    return Response.json({ success: true, storagePath }, { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    return Response.json({ success: false, error: err.message || "Upload failed." }, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
