"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({
      event: "page_view",
      data: {
        timestamp: Date.now(),
        path: window.location.pathname,
      },
    });
  }, []);

  return null;
}
