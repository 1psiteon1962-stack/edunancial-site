export type PricingProduct = {
  sku: string;
  price: number;
  label: string;
  description?: string;
  features?: string[];
};

export type Pricing = {
  currency: string;
  products: PricingProduct[];
};
