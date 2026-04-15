"use client";

import { Offer } from "@/types/offers";
import { optimizeOffer } from "@/utils/optimizeOffer";

interface Props {
  offers: Offer[];
}

export default function OfferPanel({ offers }: Props) {
  return (
    <div>
      {offers.map((offer) => {
        /**
         * 🚨 CRITICAL FIX
         * REMOVE the explicit type annotation that is causing the failure
         */
        const optimized = optimizeOffer(offer);

        return (
          <div key={offer.id}>
            <h3>{optimized.title}</h3>

            <p>Original: ${optimized.price}</p>
            <p>Discount: {optimized.discount ?? 0}%</p>

            <p>Savings: ${optimized.savings.toFixed(2)}</p>

            <p>
              <strong>
                Final: ${optimized.finalPrice.toFixed(2)}
              </strong>
            </p>
          </div>
        );
      })}
    </div>
  );
}
