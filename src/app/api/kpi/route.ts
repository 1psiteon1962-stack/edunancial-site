import { NextResponse } from "next/server";
import type { KPIEvent } from "@/lib/kpi/types";
import { writeKPIEvent } from "@/lib/kpi/writeEvent";
import { hashIP } from "@/lib/kpi/hash";

export const runtime = "nodejs";

function getClientIP(req: Request): string | null {
  // Netlify / proxies typically set x-forwarded-for
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as KPIEvent;

    if (!body?.event_name) {
      return NextResponse.json({ ok: false, error: "Missing event_name" }, { status: 400 });
    }

    const ip = getClientIP(req);
    const ip_hash = hashIP(ip);

    const user_agent = req.headers.get("user-agent");

    await writeKPIEvent(body, {
      ip_hash,
      user_agent: user_agent || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
