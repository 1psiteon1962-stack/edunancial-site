"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getSessionId(): string {
  const key = "edunancial_kpi_session";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const payload = {
      event_name: "page_view",
      session_id: getSessionId(),
      path: pathname,
      referrer: document.referrer || null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
      metadata: { title: document.title },
    };

    void fetch("/api/kpi/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  }, [pathname, searchParams]);

  return null;
}
