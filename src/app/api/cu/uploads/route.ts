import { NextResponse, type NextRequest } from "next/server";

import { requireCuAccess } from "@/lib/cu/auth";
import { filesFromFormData } from "@/lib/cu/uploads";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const unauthorized = requireCuAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const files = await filesFromFormData(await request.formData());
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
