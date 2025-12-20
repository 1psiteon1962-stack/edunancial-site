// data/products.ts

import { LiteracyLevel } from "./levels";

export interface Product {
  key: string;
  name: string;
  minimumLevel: LiteracyLevel;
  priceUSD: number;
  placeholder: boolean;
}

export const Products: Product[] = [
  {
    key: "starter-guides",
    name: "Starter Literacy Guides",
    minimumLevel: 1,
    priceUSD: 29,
    placeholder: true,
  },
  {
    key: "courses",
    name: "Core Financial Courses",
    minimumLevel: 2,
    priceUSD: 99,
    placeholder: true,
  },
  {
    key: "advanced-tools",
    name: "Advanced Analysis Tools",
    minimumLevel: 3,
    priceUSD: 249,
    placeholder: true,
  },
  {
    key: "deal-access",
    name: "Structured Deal Access",
    minimumLevel: 4,
    priceUSD: 0,
    placeholder: true,
  },
];
