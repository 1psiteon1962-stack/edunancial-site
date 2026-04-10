"use client";

import { useEffect, useState } from "react";

// ✅ SIMPLE, SAFE REGION HOOK
export function useRegion(): string {
  const [region, setRegion] = useState<string>("US");

  useEffect(() => {
    try {
      // Example: pull from browser or fallback
      const locale = navigator.language || "en-US";

      // Extract region (e.g., "en-US" → "US")
      const parts = locale.split("-");
      if (parts.length > 1) {
        setRegion(parts[1].toUpperCase());
      }
    } catch (err) {
      console.error("Region detection failed:", err);
    }
  }, []);

  return region;
}
