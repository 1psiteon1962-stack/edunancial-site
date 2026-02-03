// data/products.ts

import type { LiteracyLevel } from "./levels";

/**
 * Product represents a single Edunancial item.
 */
export interface Product {
  key: string;
  title: string;
  description: string;
  level: LiteracyLevel;
  priceUSD: number;
}

export const products: Product[] = [
  {
    key: "wealth-foundations",
    title: "Wealth Foundations",
    description: "A beginner-friendly introduction to building wealth systems.",
    level: "beginner",
    priceUSD: 9.99,
  },
  {
    key: "tax-liens-deeds",
    title: "Building Wealth with Tax Liens & Tax Deeds",
    description: "A structured guide to real estate tax-sale investing.",
    level: "intermediate",
    priceUSD: 19.99,
  },
  {
    key: "governance-scaling",
    title: "Governance & Scaling Systems",
    description: "Advanced founder-grade frameworks for serious expansion.",
    level: "advanced",
    priceUSD: 29.99,
  },
];
