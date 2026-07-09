/**
 * Admin API: manage library items (create, list all including drafts)
 * In production this would require admin authentication middleware.
 */
import { NextRequest, NextResponse } from "next/server";
import { libraryItems } from "@/lib/library/libraryData";
import type { LibraryItem } from "@/lib/library/libraryTypes";

export async function GET(_request: NextRequest) {
  // Admin sees all items regardless of status
  return NextResponse.json({ items: libraryItems, total: libraryItems.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.type || !body?.author) {
    return NextResponse.json(
      { error: "title, type, and author are required" },
      { status: 400 }
    );
  }

  const id = `${body.type}-${Date.now()}`;
  const now = new Date().toISOString().slice(0, 10);

  const item: LibraryItem = {
    id,
    type: body.type,
    title: body.title,
    author: body.author,
    description: body.description ?? "",
    longDescription: body.longDescription ?? "",
    categories: Array.isArray(body.categories) ? body.categories : [],
    tags: Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    coverImage: body.coverImage ?? "",
    status: body.status ?? "draft",
    accessLevel: body.accessLevel ?? "free",
    price: body.price ? parseFloat(body.price) : undefined,
    downloadable: body.downloadable === true || body.downloadable === "true",
    fileFormat: body.fileFormat ?? undefined,
    mediaUrl: body.mediaUrl ?? undefined,
    downloadUrl: body.downloadUrl ?? undefined,
    previewUrl: body.previewUrl ?? undefined,
    language: body.language ?? "en",
    publishedAt: now,
    updatedAt: now,
    pageCount: body.pageCount ? parseInt(body.pageCount, 10) : undefined,
    durationMinutes: body.durationMinutes ? parseInt(body.durationMinutes, 10) : undefined,
    narrator: body.narrator ?? undefined,
    downloadCount: 0,
    viewCount: 0,
  };

  libraryItems.push(item);
  return NextResponse.json({ item }, { status: 201 });
}
