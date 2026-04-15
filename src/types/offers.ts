export interface Offer {
  id: string;
  title: string;
  price: number;
  discount?: number | null;
}

export interface OptimizedOffer {
  id: string;
  title: string;
  price: number;
  discount?: number | null;
  savings: number;
  finalPrice: number;
}
