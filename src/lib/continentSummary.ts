import { KPIRecord } from "./kpiTypes";

export interface ContinentSummary {

  continent: string;

  revenue: number;

  expenses: number;

  profit: number;

  members: number;

  downloads: number;

}

export function summarizeContinent(
  continent: string,
  records: KPIRecord[]
): ContinentSummary {

  const filtered = records.filter(
    r => r.continent === continent
  );

  return {

    continent,

    revenue: filtered.reduce(
      (a,b)=>a+b.netRevenue,0
    ),

    expenses: filtered.reduce(
      (a,b)=>a+b.operatingExpense,0
    ),

    profit: filtered.reduce(
      (a,b)=>a+b.netProfit,0
    ),

    members: filtered.reduce(
      (a,b)=>a+b.activeUsers,0
    ),

    downloads: filtered.reduce(
      (a,b)=>a+b.downloads,0
    )

  };

}
