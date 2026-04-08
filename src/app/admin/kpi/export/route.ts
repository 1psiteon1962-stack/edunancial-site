import { NextResponse } from "next/server"
import { fetchEventsCSV } from "@/lib/kpi/adminQueries"

export const runtime = "nodejs"

export async function GET() {
  try {
    const csv = await fetchEventsCSV()

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=kpi-events.csv"
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export KPI data" },
      { status: 500 }
    )
  }
}
