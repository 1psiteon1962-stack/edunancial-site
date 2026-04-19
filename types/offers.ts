// types/offers.ts

export interface Offer {
  id: string;
  title: string;
  price: number;
  description?: string;
}

// ✅ This is what your component EXPECTS
export interface OptimizedOffer extends Offer {
  finalPrice: number;
  discountApplied: boolean;
}
