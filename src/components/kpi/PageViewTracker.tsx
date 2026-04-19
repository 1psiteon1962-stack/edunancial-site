"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
  useEffect(() => {
    try {
      console.log("Tracking page:", window.location.pathname);
    } catch (err) {
      console.warn("Tracking error:", err);
    }
  }, []);

  return null;
}
