import { NextRequest, NextResponse } from "next/server";
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/library/userLibraryStore";

// For demo purposes, read userId from query param or use "demo".
// In production, this would come from the session/auth token.
function resolveUserId(request: NextRequest): string {
  return new URL(request.url).searchParams.get("userId") ?? "demo";
}

export async function GET(request: NextRequest) {
  const userId = resolveUserId(request);
  const favorites = getUserFavorites(userId);
  return NextResponse.json({ favorites });
}

export async function POST(request: NextRequest) {
  const userId = resolveUserId(request);
  const body = await request.json().catch(() => null);

  if (!body?.itemId || typeof body.itemId !== "string") {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const favorite = addFavorite(userId, body.itemId);
  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = resolveUserId(request);
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const removed = removeFavorite(userId, itemId);
  if (!removed) {
    return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
