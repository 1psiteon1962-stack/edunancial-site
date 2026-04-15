"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({
      event_name: "page_view",
      path: window.location.pathname,
    });
  }, []);

  return null;
}
