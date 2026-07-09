import { NextRequest, NextResponse } from "next/server";
import { searchLibraryItems } from "@/lib/library/libraryData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const accessLevel = searchParams.get("accessLevel") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") ?? "12", 10)));

  const result = searchLibraryItems({ q, type, category, accessLevel, page, perPage });

  return NextResponse.json({ ...result, page, perPage });
}
