// src/utils/optimizeOffer.ts

import { Offer, OptimizedOffer } from "../types/offers";

export function optimizeOffer(offer: Offer): OptimizedOffer {
  const originalPrice = offer.price ?? offer.basePrice ?? 0;

  const discount = originalPrice >= 100 ? 10 : 0;
  const savings = originalPrice * (discount / 100);
  const finalPrice = originalPrice - savings;

  return {
    id: offer.id,
    title: offer.title,
    price: originalPrice,
    finalPrice,
    discount,
    savings,
    description: offer.description,
    discountApplied: discount > 0,
  };
}
