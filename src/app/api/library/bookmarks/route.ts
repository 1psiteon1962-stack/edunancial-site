import { NextRequest, NextResponse } from "next/server";
import {
  getUserBookmarks,
  upsertBookmark,
  deleteBookmark,
} from "@/lib/library/userLibraryStore";
import type { UserBookmark } from "@/lib/library/libraryTypes";

function resolveUserId(request: NextRequest): string {
  return new URL(request.url).searchParams.get("userId") ?? "demo";
}

export async function GET(request: NextRequest) {
  const userId = resolveUserId(request);
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId") ?? undefined;

  const bookmarks = getUserBookmarks(userId, itemId);
  return NextResponse.json({ bookmarks });
}

export async function POST(request: NextRequest) {
  const userId = resolveUserId(request);
  const body = await request.json().catch(() => null);

  if (!body?.itemId || !body?.position) {
    return NextResponse.json(
      { error: "itemId and position are required" },
      { status: 400 }
    );
  }

  const positionType: UserBookmark["positionType"] =
    body.positionType ?? "page";

  const bookmark = upsertBookmark(
    userId,
    body.itemId,
    String(body.position),
    positionType,
    body.note
  );

  return NextResponse.json({ bookmark }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = resolveUserId(request);
  const { searchParams } = new URL(request.url);
  const bookmarkId = searchParams.get("bookmarkId");

  if (!bookmarkId) {
    return NextResponse.json({ error: "bookmarkId is required" }, { status: 400 });
  }

  const removed = deleteBookmark(userId, bookmarkId);
  if (!removed) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
