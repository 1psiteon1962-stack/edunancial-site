"use client";

import { useEffect } from "react";
import { trackKPI } from "../../lib/kpi/client";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({ eventName: "page_view" });
  }, []);

  return null;
}
