"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/client";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({
      event: "page_view",
      metadata: {
        path: window.location.pathname,
      },
    });
  }, []);

  return null;
}
