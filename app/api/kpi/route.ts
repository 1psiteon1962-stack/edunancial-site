import { NextResponse } from "next/server";
import { buildKPIRecord } from "@/lib/kpi-pipeline";

export async function POST(req: Request) {
  const body = await req.json();
  const record = buildKPIRecord(body, "web");

  return NextResponse.json({
    ok: true,
    recordId: record.recordId,
  });
}
