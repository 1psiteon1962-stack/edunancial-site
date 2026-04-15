export interface Offer {
  id: string;
  title: string;
  price: number;
  discount?: number | null;
}

export interface OptimizedOffer extends Offer {
  savings: number;
  finalPrice: number;
}
