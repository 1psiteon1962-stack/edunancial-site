import { NextResponse, type NextRequest } from "next/server";

import { requireCuAccess } from "@/lib/cu/auth";
import { publishCuFiles } from "@/lib/cu/publish";
import type { CuPublishInput } from "@/lib/cu/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const unauthorized = requireCuAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const payload = (await request.json()) as { files?: CuPublishInput[] };
    const files = Array.isArray(payload.files) ? payload.files : [];
    if (files.length === 0) {
      return NextResponse.json({ error: "Select at least one file to publish." }, { status: 400 });
    }

    const result = await publishCuFiles(files);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publish failed" },
      { status: 500 },
    );
  }
}
