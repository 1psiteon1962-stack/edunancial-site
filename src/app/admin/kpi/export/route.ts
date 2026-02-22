import { NextResponse } from "next/server";
import { fetchEventsCSV } from "@/lib/kpi/adminQueries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const days = Number(searchParams.get("days") || "30");
  const site_region = searchParams.get("site_region") || "";
  const site_id = searchParams.get("site_id") || "";

  const csv = await fetchEventsCSV({
    days: Number.isFinite(days) ? days : 30,
    site_region: site_region || null,
    site_id: site_id || null,
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="kpi_events_last_${days}_days.csv"`,
    },
  });
}
