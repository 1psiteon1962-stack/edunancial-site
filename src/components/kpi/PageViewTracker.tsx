"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

/**
 * PageViewTracker
 * Global page tracking component
 * Safe for production — never breaks build
 */
export default function PageViewTracker() {
  useEffect(() => {
    try {
      trackKPI("page_view", {
        path: window.location.pathname,
      });
    } catch (err) {
      console.warn("Tracking error:", err);
    }
  }, []);

  return null;
}
