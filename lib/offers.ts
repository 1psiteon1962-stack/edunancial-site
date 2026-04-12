export interface Offer {
  id: string;
  title: string;
  price: number;
  form?: string;
}

export interface OptimizedOffer {
  id: string;
  title: string;
  price: number;
  form: string;
  formattedPrice: string;
}

export function optimizeOffer(offer: Offer, region?: string): OptimizedOffer {
  const basePrice = offer.price ?? 0;

  // simple regional adjustment (safe default)
  let adjustedPrice = basePrice;

  if (region === 'eu') adjustedPrice = basePrice * 1.1;
  if (region === 'latam') adjustedPrice = basePrice * 0.9;

  return {
    id: offer.id,
    title: offer.title,
    price: adjustedPrice,
    form: offer.form ?? 'standard',
    formattedPrice: `$${adjustedPrice.toFixed(2)}`
  };
}
