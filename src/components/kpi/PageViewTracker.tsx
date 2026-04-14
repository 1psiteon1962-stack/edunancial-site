"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({
      event_name: "page_view", // ✅ matches your union type
      event_type: "auto",

      path: window.location.pathname,
      referrer: document.referrer || null,

      metadata: {},
    });
  }, []);

  return null;
}
