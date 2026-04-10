"use client";

import { useEffect, useState } from "react";

export function useRegion(): string {
  const [region, setRegion] = useState<string>("us");

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("region")
          : null;

      if (stored && stored.trim() !== "") {
        setRegion(stored);
        return;
      }

      const lang =
        typeof navigator !== "undefined"
          ? navigator.language.toLowerCase()
          : "en";

      if (lang.includes("es")) {
        setRegion("latam");
      } else if (lang.includes("fr")) {
        setRegion("eu");
      } else {
        setRegion("us");
      }
    } catch {
      setRegion("us");
    }
  }, []);

  return region;
}
