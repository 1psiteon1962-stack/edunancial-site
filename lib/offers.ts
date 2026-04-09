export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export function optimizeOffer(offer: Offer): Offer {
  return {
    ...offer,
    priceUSD: offer.priceUSD ?? 0,
    comingSoon: offer.comingSoon ?? false,
  };
}
