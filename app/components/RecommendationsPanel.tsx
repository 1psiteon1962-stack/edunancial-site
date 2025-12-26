"use client";

import { useEffect, useState } from "react";
import { Region } from "@/lib/core";
import { getEvents } from "@/lib/metrics";
import { deriveConclusion, Conclusion } from "@/lib/conclusions";

/**
 * RecommendationsPanel
 * ---------------------
 * Converts observed user behavior into a concrete next action.
 * Safe for Netlify static export.
 * Gracefully handles first-time visitors (no metrics yet).
 */

type Props = {
  region: Region;
};

export default function RecommendationsPanel({ region }: Props) {
  const [result, setResult] = useState<Conclusion | null>(null);

  useEffect(() => {
    // HARD GUARD: prevent execution during build / SSR
    if (typeof window === "undefined") return;

    const events = getEvents().filter(
      (e) => e.region === region
    );

    const conclusion = deriveConclusion(region, events);
    setResult(conclusion);
  }, [region]);

  // Render nothing until client-side hydration completes
  if (!result) return null;

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: "2px solid #111",
        borderRadius: "12px",
        background: "#fafafa",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>
        Your Next Step
      </h2>

      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Status:</strong>{" "}
        {result.userStage.toUpperCase()}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Recommended Action</strong>
        <br />
        {result.recommendedAction}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Suggested Module</strong>
        <br />
        {result.recommendedModule}
      </p>

      {result.upsellLevel && (
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #ccc",
          }}
        >
          <strong>Next Level Available:</strong>{" "}
          {result.upsellLevel}
          <br />
          <a
            href="/membership"
            style={{ textDecoration: "underline" }}
          >
            View Membership Options
          </a>
        </div>
      )}
    </section>
  );
}
