'use client';

import React from 'react';
import { optimizeOffer } from '@/lib/offers';
import { useRegion } from '@/lib/hooks/useRegion';

interface Offer {
  id: string;
  title: string;
  price: number;
}

interface OptimizedOffer {
  price: number;
  formattedPrice: string;
}

interface OfferPanelProps {
  offers: Offer[];
}

export default function OfferPanel({ offers }: OfferPanelProps) {
  const region = useRegion();

  return (
    <div>
      {offers.map((offer) => {
        const optimized: OptimizedOffer = optimizeOffer(offer, region);

        return (
          <div key={offer.id}>
            <h3>{offer.title}</h3>

            {/* FIX: render a string/number, NOT the object */}
            <p>Price: {optimized.formattedPrice ?? optimized.price}</p>
          </div>
        );
      })}
    </div>
  );
}
