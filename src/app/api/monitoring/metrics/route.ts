import { NextRequest, NextResponse } from "next/server";
import { getMetricsProvider } from "@/lib/monitoring";

/**
 * GET /api/monitoring/metrics
 *
 * Returns a live infrastructure snapshot from the configured metrics provider.
 * Defaults to the deterministic demo provider. Swap in a real provider via
 * setMetricsProvider() in your server startup.
 */
export async function GET(_req: NextRequest) {
  try {
    const provider = getMetricsProvider();
    const snapshot = await provider.fetchSnapshot();
    return NextResponse.json({ ok: true, data: snapshot }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
