import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedSupabaseUser } from "@/lib/auth/server";
import { getLibraryItem } from "@/lib/library/libraryData";
import {
  recordDownload,
  getUserDownloads,
  isUserEntitled,
  grantEntitlement,
} from "@/lib/library/userLibraryStore";

async function authenticatedUserId() {
  const user = await getAuthenticatedSupabaseUser();
  return user?.id ?? null;
}

export async function GET() {
  const userId = await authenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const downloads = getUserDownloads(userId);
  return NextResponse.json({ downloads });
}

export async function POST(request: NextRequest) {
  const userId = await authenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

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

  if (item.accessLevel === "free") {
    grantEntitlement(userId, item.id, "free");
  } else if (!isUserEntitled(userId, item.id)) {
    return NextResponse.json(
      { error: "Not entitled. Please purchase or subscribe to access this item." },
      { status: 403 },
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
    userAgent,
  );

  return NextResponse.json({ event, downloadUrl: item.downloadUrl ?? null });
}
