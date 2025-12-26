import { Region } from "@/lib/core";

export type SaleEvent = {
  region: Region;
  amount: number;
  offerId: string;
};

const SALES: SaleEvent[] = [];

export function recordSale(event: SaleEvent) {
  SALES.push(event);
}

export function getMetrics() {
  const byRegion: Record<string, number> = {};
  let total = 0;

  SALES.forEach((s) => {
    total += s.amount;
    byRegion[s.region] = (byRegion[s.region] || 0) + s.amount;
  });

  return {
    totalRevenue: total,
    revenueByRegion: byRegion,
    totalSales: SALES.length,
    arpu: SALES.length ? total / SALES.length : 0,
  };
}
