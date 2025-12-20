import { LiteracyLevel } from "./levels";

export const PRICING_BY_LEVEL: Partial<Record<LiteracyLevel, {
  monthlyUSD: number;
  annualUSD: number;
}>> = {
  3: { monthlyUSD: 19, annualUSD: 199 },
  4: { monthlyUSD: 49, annualUSD: 499 },
  5: { monthlyUSD: 99, annualUSD: 999 },
};
