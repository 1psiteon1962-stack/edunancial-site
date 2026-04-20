// src/types/offers.ts

/**
 * Base offer coming from system / catalog
 */
export interface Offer {
  id: string;
  title: string;
  basePrice: number;

  /**
   * Optional description of the offer
   */
  description?: string;
}

/**
 * Optimized version used in UI (OfferPanel)
 */
export interface OptimizedOffer {
  id: string;
  title: string;

  /**
   * Final computed price after optimization
   */
  finalPrice: number;

  /**
   * MUST exist here because OfferPanel uses it
   */
  description?: string;
}
