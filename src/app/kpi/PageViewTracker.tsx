"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

/**
 * PageViewTracker
 * Tracks page visits safely without breaking build
 */
export default function PageViewTracker() {
  useEffect(() => {
    trackKPI("page_view", {
      path: window.location.pathname,
    });
  }, []);

  return null;
}
