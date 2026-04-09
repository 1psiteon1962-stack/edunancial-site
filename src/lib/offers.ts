export type OptimizeOfferInput = {
  basePriceUSD: number
  region?: string
  demandMultiplier?: number
}

export type OptimizedOffer = {
  finalPriceUSD: number
  discountApplied: boolean
  notes?: string
}

/**
 * Core pricing logic for Edunancial offers.
 * This is where regional pricing, promotions, and scaling logic will live.
 */
export function optimizeOffer(
  input: OptimizeOfferInput
): OptimizedOffer {
  const {
    basePriceUSD,
    region,
    demandMultiplier = 1,
  } = input

  let finalPrice = basePriceUSD * demandMultiplier
  let discountApplied = false
  let notes = ""

  // Example regional pricing logic (expand later)
  if (region === "africa" || region === "latin-america") {
    finalPrice = finalPrice * 0.7
    discountApplied = true
    notes = "Regional pricing adjustment applied"
  }

  // Safety floor (no free giveaways unless intentional)
  if (finalPrice < 1) {
    finalPrice = 1
  }

  return {
    finalPriceUSD: Math.round(finalPrice),
    discountApplied,
    notes,
  }
}
