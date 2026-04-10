"use client";

import { useEffect, useState } from "react";

export function useRegion(): string {
  const [region, setRegion] = useState<string>("US");

  useEffect(() => {
    try {
      if (process.env.NEXT_PUBLIC_DEFAULT_REGION) {
        setRegion(process.env.NEXT_PUBLIC_DEFAULT_REGION);
        return;
      }

      if (typeof navigator !== "undefined") {
        const locale = navigator.language || "en-US";
        const parts = locale.split("-");
        if (parts.length > 1) {
          setRegion(parts[1].toUpperCase());
          return;
        }
      }

      setRegion("US");
    } catch {
      setRegion("US");
    }
  }, []);

  return region;
}
