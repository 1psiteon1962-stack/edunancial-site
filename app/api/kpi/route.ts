import { NextResponse } from "next/server";
import type { UserProfileKPI } from "@/lib/kpi-types";
import { normalizeUserKPI } from "@/lib/kpi-ingest";

export async function POST(req: Request) {
  const body = (await req.json()) as UserProfileKPI;

  const normalized = normalizeUserKPI(body);

  // Placeholder: future DB / warehouse
  console.log("KPI_EVENT", normalized);

  return NextResponse.json({ status: "ok" });
}
