import type { KPIEventInput } from "./types";

function getOrCreateId(key: string) {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

function getUTM() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  return {
    source: url.searchParams.get("utm_source") || undefined,
    medium: url.searchParams.get("utm_medium") || undefined,
    campaign: url.searchParams.get("utm_campaign") || undefined,
    term: url.searchParams.get("utm_term") || undefined,
    content: url.searchParams.get("utm_content") || undefined,
  };
}

export async function trackKPI(input: KPIEventInput) {
  if (typeof window === "undefined") return;

  const visitorId = getOrCreateId("edunancial_visitor_id");
  const sessionId = getOrCreateId("edunancial_session_id");

  const payload = {
    eventName: input.eventName,
    pathname: input.pathname || window.location.pathname,
    referrer: input.referrer || document.referrer || "",
    visitorId,
    sessionId,
    productSku: input.productSku,
    price: input.price,
    currency: input.currency,
    orderId: input.orderId,
    paymentProvider: input.paymentProvider,
    payload: input.payload || {},
    utm: input.utm || getUTM(),
  };

  // Fire-and-forget; never block UX
  fetch("/api/kpi/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
