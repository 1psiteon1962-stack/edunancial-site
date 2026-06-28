import { KPIRecord } from "./kpiTypes";

export interface ProductKPI {
  product: string;
  revenue: number;
  profit: number;
  downloads: number;
}

export function summarizeProduct(
  product: string,
  records: KPIRecord[]
): ProductKPI {

  const filtered = records.filter(
    (record) => record.product === product
  );

  return {
    product,
    revenue: filtered.reduce((t, r) => t + r.netRevenue, 0),
    profit: filtered.reduce((t, r) => t + r.netProfit, 0),
    downloads: filtered.reduce((t, r) => t + r.downloads, 0),
  };

}
