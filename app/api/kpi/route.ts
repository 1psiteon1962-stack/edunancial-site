// app/api/kpi/route.ts

import { NextResponse } from "next/server";
import { buildKPIRecord } from "@/lib/airtable";
import { UserProfileKPI } from "@/lib/types/user-profile-kpi";

export async function POST(req: Request) {
  const body = (await req.json()) as UserProfileKPI;

  const record = buildKPIRecord(body, "web");

  return NextResponse.json({
    ok: true,
    record,
  });
}
