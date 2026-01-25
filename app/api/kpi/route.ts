// app/api/kpi/route.ts

import { NextResponse } from "next/server";
import { buildKPIRecord } from "@/lib/airtable";

export async function POST(req: Request) {
  const body = await req.json();

  // FIX: buildKPIRecord ONLY TAKES ONE ARGUMENT
  const record = buildKPIRecord(body);

  return NextResponse.json({
    ok: true,
    record,
  });
}
