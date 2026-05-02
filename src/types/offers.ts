// src/types/offers.ts

export interface Offer {
  id: string;
  title: string;
  price: number;
  basePrice?: number;
  description?: string;
}

export interface OptimizedOffer {
  id: string;
  title: string;
  price: number;
  finalPrice: number;
  discount: number;
  savings: number;
  description?: string;
  discountApplied?: boolean;
}
