type OptimizeOfferInput = {
  priceUSD: number;
  region: string;
};

export function optimizeOffer({ priceUSD, region }: OptimizeOfferInput) {
  let multiplier = 1;

  switch (region) {
    case "AFRICA":
      multiplier = 0.5;
      break;
    case "LATAM":
      multiplier = 0.7;
      break;
    case "EU":
      multiplier = 1.1;
      break;
    default:
      multiplier = 1;
  }

  return {
    finalPrice: Math.round(priceUSD * multiplier),
  };
}
