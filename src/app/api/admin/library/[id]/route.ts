/**
 * Admin API: get, update, or delete a single library item by id.
 */
import { NextRequest, NextResponse } from "next/server";
import { libraryItems, getLibraryItem } from "@/lib/library/libraryData";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getLibraryItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = libraryItems.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const item = libraryItems[idx];
  const updated = {
    ...item,
    ...body,
    id: item.id, // id is immutable
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  libraryItems[idx] = updated;
  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = libraryItems.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  libraryItems.splice(idx, 1);
  return NextResponse.json({ success: true });
}
