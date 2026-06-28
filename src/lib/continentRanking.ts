import { KPIRecord } from "./kpiTypes";

export interface ContinentRanking {
  continent: string;
  revenue: number;
  profit: number;
}

export function rankContinents(records: KPIRecord[]): ContinentRanking[] {
  const map = new Map<string, ContinentRanking>();

  records.forEach((record) => {
    const current = map.get(record.continent) ?? {
      continent: record.continent,
      revenue: 0,
      profit: 0,
    };

    current.revenue += record.netRevenue;
    current.profit += record.netProfit;

    map.set(record.continent, current);
  });

  return [...map.values()].sort(
    (a, b) => b.profit - a.profit
  );
}
