interface OptimizeOfferInput {
  priceUSD: number;
  region: string;
}

export function optimizeOffer({ priceUSD, region }: OptimizeOfferInput): number {
  switch (region) {
    case "latam":
      return Math.round(priceUSD * 0.7);

    case "eu":
      return Math.round(priceUSD * 0.9);

    case "us":
    default:
      return priceUSD;
  }
}
