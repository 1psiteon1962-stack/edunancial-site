import { NextRequest, NextResponse } from "next/server";
import {
  recordDownload,
  getUserDownloads,
  isUserEntitled,
  grantEntitlement,
} from "@/lib/library/userLibraryStore";
import { getLibraryItem } from "@/lib/library/libraryData";

function resolveUserId(request: NextRequest): string {
  return new URL(request.url).searchParams.get("userId") ?? "demo";
}

export async function GET(request: NextRequest) {
  const userId = resolveUserId(request);
  const downloads = getUserDownloads(userId);
  return NextResponse.json({ downloads });
}

export async function POST(request: NextRequest) {
  const userId = resolveUserId(request);
  const body = await request.json().catch(() => null);

  if (!body?.itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const item = getLibraryItem(body.itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (!item.downloadable) {
    return NextResponse.json({ error: "Item is not downloadable" }, { status: 400 });
  }

  // Entitlement check — free items are automatically accessible
  if (item.accessLevel === "free") {
    // Auto-grant entitlement for free items
    grantEntitlement(userId, item.id, "free");
  } else if (!isUserEntitled(userId, item.id)) {
    return NextResponse.json(
      { error: "Not entitled. Please purchase or subscribe to access this item." },
      { status: 403 }
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded ? forwarded.split(",")[0].trim() : undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const event = recordDownload(
    userId,
    item.id,
    item.fileFormat ?? "unknown",
    item.fileSizeBytes,
    ipAddress,
    userAgent
  );

  return NextResponse.json({ event, downloadUrl: item.downloadUrl ?? null });
}
