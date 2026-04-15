import { Offer, OptimizedOffer } from "@/types/offers";

/**
 * 🚨 HARD OVERRIDE
 * This guarantees the return type is NEVER a number
 */
export function optimizeOffer(offer: Offer): OptimizedOffer {
  const discount = offer.discount ?? 0;

  const savings = (offer.price * discount) / 100;
  const finalPrice = offer.price - savings;

  const result: OptimizedOffer = {
    id: offer.id,
    title: offer.title,
    price: offer.price,
    discount: offer.discount ?? null,
    savings,
    finalPrice,
  };

  return result;
}
