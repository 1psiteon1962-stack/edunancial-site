"use client";

import { useEffect } from "react";

type RegionAnalyticsHookProps = {
  region: string;
  surface: string;
};

export default function RegionAnalyticsHook({
  region,
  surface,
}: RegionAnalyticsHookProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("edunancial:region-architecture-view", {
        detail: { region, surface },
      })
    );
  }, [region, surface]);

  return null;
}
