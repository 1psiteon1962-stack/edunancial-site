"use client";

import { useEffect } from "react";
import { trackKPI } from "@/lib/kpi/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI("page_view");
  }, []);

  return null;
}
