import { KPIRecord } from "./kpiTypes";

export interface CountryRanking {
  country: string;
  revenue: number;
  profit: number;
}

export function rankCountries(records: KPIRecord[]) {

  const map = new Map<string, CountryRanking>();

  records.forEach((record) => {

    const current = map.get(record.country) ?? {
      country: record.country,
      revenue: 0,
      profit: 0,
    };

    current.revenue += record.netRevenue;
    current.profit += record.netProfit;

    map.set(record.country, current);

  });

  return [...map.values()].sort(
    (a, b) => b.profit - a.profit
  );

}
