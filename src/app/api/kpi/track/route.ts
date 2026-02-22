import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/kpi/supabaseAdmin";
import { getSiteContext } from "../../../lib/kpi/site";
import { sha256 } from "../../../lib/kpi/hash";

export async function POST(req: Request) {
  try {
    const { site_id, site_region } = getSiteContext();

    const body = await req.json().catch(() => ({}));
    const {
      eventName,
      pathname,
      referrer,
      visitorId,
      sessionId,
      productSku,
      price,
      currency,
      orderId,
      paymentProvider,
      payload,
      utm,
    } = body || {};

    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ ok: false, error: "Missing eventName" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const ip_hash = ip ? sha256(ip) : null;

    const { error } = await supabaseAdmin.from("kpi_events").insert([
      {
        site_id,
        site_region,
        event_name: eventName,
        pathname: pathname || null,
        referrer: referrer || null,
        visitor_id: visitorId || null,
        session_id: sessionId || null,
        product_sku: productSku || null,
        price: typeof price === "number" ? price : null,
        currency: currency || null,
        order_id: orderId || null,
        payment_provider: paymentProvider || null,
        user_agent: ua || null,
        ip_hash,
        utm_source: utm?.source || null,
        utm_medium: utm?.medium || null,
        utm_campaign: utm?.campaign || null,
        utm_term: utm?.term || null,
        utm_content: utm?.content || null,
        payload: payload && typeof payload === "object" ? payload : {},
      },
    ]);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
