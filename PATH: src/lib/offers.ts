export interface OptimizeOfferOptions {
  priceUSD: number;
  region: string;
}

export function optimizeOffer({
  priceUSD,
  region,
}: OptimizeOfferOptions) {
  let multiplier = 1;

  switch (region) {
    case "US":
      multiplier = 1;
      break;
    case "EU":
      multiplier = 0.92;
      break;
    case "AF":
      multiplier = 0.75;
      break;
    default:
      multiplier = 1;
  }

  const finalPrice = priceUSD * multiplier;

  return {
    finalPrice,
    displayPrice: `$${finalPrice.toFixed(2)}`,
  };
}
