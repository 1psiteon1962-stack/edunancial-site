import { NextResponse } from "next/server";
import { success } from "@/lib/api/response";

export const runtime = "edge";

export async function GET() {
  return success({
    status: "ok",
    version: "2",
    timestamp: new Date().toISOString(),
    note: "API v2 is forward-compatible with v1",
  });
}
