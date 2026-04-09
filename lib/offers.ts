export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export interface OptimizeOfferOptions {
  priceUSD: number;
  region?: string;
}

export interface OptimizedOffer {
  finalPriceUSD: number;
  discountApplied: boolean;
  notes?: string;
}

export function optimizeOffer(
  options: OptimizeOfferOptions
): OptimizedOffer {
  const { priceUSD, region } = options;

  let finalPriceUSD = priceUSD;
  let discountApplied = false;
  let notes = "";

  if (region === "africa" || region === "latin-america" || region === "latam") {
    finalPriceUSD = Math.round(priceUSD * 0.7);
    discountApplied = true;
    notes = "Regional pricing adjustment applied";
  }

  if (finalPriceUSD < 1) {
    finalPriceUSD = 1;
  }

  return {
    finalPriceUSD,
    discountApplied,
    notes,
  };
}
