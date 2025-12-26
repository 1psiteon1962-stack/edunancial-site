"use client";

import { optimizeOffer } from "@/lib/offers";
import { Conclusion } from "@/lib/conclusions";
import { Region } from "@/lib/core";

type Props = {
  region: Region;
  conclusion: Conclusion;
};

export default function OfferPanel({ region, conclusion }: Props) {
  const offer = optimizeOffer(region, conclusion);

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: "2px solid #000",
        borderRadius: "10px",
        background: "#fff",
      }}
    >
      <h2>{offer.primary.title}</h2>
      <p>{offer.primary.description}</p>
      <p>
        <strong>${offer.primary.priceUSD.toFixed(2)}</strong>
      </p>

      <button
        style={{
          marginTop: "0.75rem",
          padding: "0.5rem 1rem",
          border: "1px solid #000",
          background: "#000",
          color: "#fff",
        }}
      >
        Continue
      </button>

      {offer.secondary && (
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #ccc",
          }}
        >
          <strong>Optional Next Step</strong>
          <p>{offer.secondary.title}</p>
          <p>${offer.secondary.priceUSD.toFixed(2)}</p>
        </div>
      )}
    </section>
  );
}
