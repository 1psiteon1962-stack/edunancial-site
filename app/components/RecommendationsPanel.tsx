"use client";

import { useEffect, useState } from "react";
import { Region } from "@/lib/core";
import { getEvents } from "@/lib/metrics";
import { deriveConclusion, Conclusion } from "@/lib/conclusions";

export default function RecommendationsPanel({ region }: { region: Region }) {
  const [result, setResult] = useState<Conclusion | null>(null);

  useEffect(() => {
    const events = getEvents().filter((e) => e.region === region);
    setResult(deriveConclusion(region, events));
  }, [region]);

  if (!result) return null;

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.2rem",
        border: "2px solid #111",
        borderRadius: 12,
      }}
    >
      <h2>Your Next Step</h2>

      <p>
        <strong>Status:</strong> {result.userStage}
      </p>

      <p>
        <strong>Recommended Action:</strong>
        <br />
        {result.recommendedAction}
      </p>

      <p>
        <strong>Suggested Module:</strong>
        <br />
        {result.recommendedModule}
      </p>

      {result.upsellLevel && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Next Level Available:</strong>{" "}
          {result.upsellLevel}
          <br />
          <a href="/membership">View Membership Options</a>
        </div>
      )}
    </section>
  );
}
