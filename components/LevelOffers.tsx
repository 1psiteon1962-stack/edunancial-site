"use client"

import { LEVEL_OFFERS, Level } from "@/lib/level-offers"

type Props = {
  level: Level
}

export default function LevelOffersComponent({ level }: Props) {
  const offers = LEVEL_OFFERS[level] || []

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Available Offers</h2>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              border: "1px solid #ccc",
              padding: "1.5rem",
              borderRadius: "10px",
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
              {offer.comingSoon ? "Coming Soon" : "Get Access"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
