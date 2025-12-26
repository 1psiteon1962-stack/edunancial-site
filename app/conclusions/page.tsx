import { getEvents } from "@/lib/metrics";
import { deriveConclusion } from "@/lib/conclusions";
import { Region } from "@/lib/core";

export const dynamic = "error";

export default function Page() {
  const regions: Region[] = ["US", "LATAM", "AFRICA", "EU", "MENA"];
  const events = typeof window === "undefined" ? [] : getEvents();

  return (
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "auto" }}>
      <h1>Founder Conclusions Engine</h1>
      <p>
        This page converts behavior into decisions. No guessing.
      </p>

      {regions.map((region) => {
        const regionEvents = events.filter((e) => e.region === region);
        const c = deriveConclusion(region, regionEvents);

        return (
          <section
            key={region}
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: 10,
            }}
          >
            <h2>{region}</h2>
            <ul>
              <li>
                <strong>Stage:</strong> {c.userStage}
              </li>
              <li>
                <strong>Action:</strong> {c.recommendedAction}
              </li>
              <li>
                <strong>Module:</strong> {c.recommendedModule}
              </li>
              {c.upsellLevel && (
                <li>
                  <strong>Upsell Target:</strong> {c.upsellLevel}
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
