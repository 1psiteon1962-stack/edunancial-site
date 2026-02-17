// src/types/plans.ts

export type Plan = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  features?: string[];
  [key: string]: any;
};
