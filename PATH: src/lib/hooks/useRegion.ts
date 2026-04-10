"use client";

import { useEffect, useState } from "react";

/**
 * Returns a guaranteed region string for pricing + routing logic
 * Never returns undefined (prevents TypeScript build failures)
 */
export function useRegion(): string {
  const [region, setRegion] = useState<string>("US"); // safe default

  useEffect(() => {
    try {
      // Priority 1: environment override (for SSR / Netlify)
      if (process.env.NEXT_PUBLIC_DEFAULT_REGION) {
        setRegion(process.env.NEXT_PUBLIC_DEFAULT_REGION);
        return;
      }

      // Priority 2: browser locale
      if (typeof navigator !== "undefined") {
        const locale = navigator.language || "en-US";
        const parts = locale.split("-");

        if (parts.length > 1) {
          setRegion(parts[1].toUpperCase());
          return;
        }
      }

      // Fallback
      setRegion("US");
    } catch (err) {
      console.error("useRegion error:", err);
      setRegion("US");
    }
  }, []);

  return region;
}
