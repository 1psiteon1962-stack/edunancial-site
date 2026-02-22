import { NextResponse } from "next/server";
import type { LeadCapturePayload } from "@/lib/diagnostic/types";
import { captureLead } from "@/lib/leadCapture";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as LeadCapturePayload;
    const result = await captureLead(payload);

    return NextResponse.json({
      ok: true,
      id: result.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Lead capture failed.",
      },
      { status: 400 }
    );
  }
}
