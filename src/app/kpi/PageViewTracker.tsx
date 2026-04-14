"use client";

import { useEffect } from "react";

// ✅ FIX: use RELATIVE import (bypass alias issues completely)
import { trackKPI } from "../../lib/kpi/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackKPI({
      event: "page_view",
      data: {
        timestamp: Date.now(),
      },
    });
  }, []);

  return null;
}
