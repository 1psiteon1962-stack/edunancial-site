"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
  useEffect(() => {
    try {
      console.log("Page view:", window.location.pathname);
    } catch (err) {
      console.warn("Tracking error:", err);
    }
  }, []);

  return null;
}
