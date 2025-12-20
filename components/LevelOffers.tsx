// components/LevelOffers.tsx
"use client";

import { LevelOffers, Level } from "@/lib/level-offers";

export default function LevelOffersComponent({
  level,
}: {
  level: Level;
}) {
  const offers = LevelOffers[level];

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: "3rem" }}>
      <h2>Available Programs for Level {level}</h2>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              border: "1px solid #ccc",
              padding: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <p>
              <strong>${offer.priceUSD} USD</strong>
            </p>

            <button
              disabled={offer.comingSoon}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.25rem",
                cursor: offer.comingSoon ? "not-allowed" : "pointer",
              }}
            >
              {offer.comingSoon ? "Coming Soon" : "Enroll"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
