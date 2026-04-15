import { Offer, OptimizedOffer } from "@/types/offers";

/**
 * 🔒 HARD LOCK:
 * This function MUST return OptimizedOffer
 */
export function optimizeOffer(offer: Offer): OptimizedOffer {
  const discount = offer.discount ?? 0;

  const savings = (offer.price * discount) / 100;
  const finalPrice = offer.price - savings;

  return {
    id: offer.id,
    title: offer.title,
    price: offer.price,
    discount: offer.discount ?? null,

    savings,
    finalPrice,
  };
}
