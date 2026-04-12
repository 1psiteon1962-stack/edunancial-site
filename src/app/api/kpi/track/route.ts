import { NextResponse } from "next/server";

// ✅ FINAL CORRECT PATH (4 levels up — EXACT)
import { getSiteContext } from "../../../../lib/kpi/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = getSiteContext(request);

    return NextResponse.json({
      success: true,
      context,
    });
  } catch (error) {
    console.error("KPI TRACK ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
