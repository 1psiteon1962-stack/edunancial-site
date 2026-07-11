import { NextRequest, NextResponse } from "next/server";
import {
  getUserProgress,
  upsertProgress,
} from "@/lib/library/userLibraryStore";

function resolveUserId(request: NextRequest): string {
  return new URL(request.url).searchParams.get("userId") ?? "demo";
}

export async function GET(request: NextRequest) {
  const userId = resolveUserId(request);
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId") ?? undefined;

  const progress = getUserProgress(userId, itemId);
  return NextResponse.json({ progress });
}

export async function PUT(request: NextRequest) {
  const userId = resolveUserId(request);
  const body = await request.json().catch(() => null);

  if (!body?.itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const progressPercent = typeof body.progressPercent === "number"
    ? body.progressPercent
    : 0;

  const record = upsertProgress(
    userId,
    body.itemId,
    progressPercent,
    body.positionReference ?? "0",
    body.timeSpentSeconds ?? 0
  );

  return NextResponse.json({ progress: record });
}
