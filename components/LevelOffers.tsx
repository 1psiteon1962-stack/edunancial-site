"use client";

import { LEVEL_OFFERS, Level } from "@/lib/level-offers";

interface Props {
  level: Level;
}

export default function LevelOffersComponent({ level }: Props) {
  const offers = LEVEL_OFFERS[level] || [];

  return (
    <div>
      {offers.map((offer) => (
        <div
          key={offer.id}
          style={{
            border: "1px solid #ccc",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <h3>{offer.title}</h3>
          <p>{offer.description}</p>
          <p>
            <strong>${offer.priceUSD} USD</strong>
          </p>

          <button
            disabled={Boolean(offer.comingSoon)}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.25rem",
              cursor: offer.comingSoon ? "not-allowed" : "pointer",
            }}
          >
            {offer.comingSoon ? "Coming Soon" : "Select"}
          </button>
        </div>
      ))}
    </div>
  );
}
