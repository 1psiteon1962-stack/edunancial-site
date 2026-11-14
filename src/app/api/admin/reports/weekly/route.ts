import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

import { requireAdminApiSession, requireOwnerApiSession } from "@/lib/admin-content/auth";
import { REPORT_STORE, buildWeeklyOwnerReport, listWeeklyOwnerReports, saveWeeklyOwnerReport } from "@/lib/reports/weekly-owner-report";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  const date = new URL(request.url).searchParams.get("date");
  try {
    const { dates, latest } = await listWeeklyOwnerReports();
    const report = date && /^\d{4}-\d{2}-\d{2}$/u.test(date)
      ? await getStore({ name: REPORT_STORE, consistency: "strong" }).get(`weekly/${date}.md`)
      : latest;
    return NextResponse.json({ dates, report: report ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to read reports." }, { status: 500 });
  }
}

/** Owner: build and save a report right now (not posted to GitHub). */
export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { date, markdown } = await buildWeeklyOwnerReport();
    await saveWeeklyOwnerReport(date, markdown);
    return NextResponse.json({ ok: true, date, report: markdown });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to build report." }, { status: 500 });
  }
}
