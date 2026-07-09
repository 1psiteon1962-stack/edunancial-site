import { NextResponse } from "next/server";
import { getDemoSummary } from "@/lib/backup";

/**
 * GET /api/backups/status
 *
 * Returns backup dashboard summary including schedule state and recent backup records.
 */
export async function GET() {
  try {
    const summary = getDemoSummary();
    return NextResponse.json({ ok: true, data: summary }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
