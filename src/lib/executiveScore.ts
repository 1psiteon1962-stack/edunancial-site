import { KPIRecord } from "./kpiTypes";

export function executiveScore(records: KPIRecord[]) {

  const revenue = records.reduce(
    (a, b) => a + b.netRevenue,
    0
  );

  const profit = records.reduce(
    (a, b) => a + b.netProfit,
    0
  );

  const margin =
    revenue === 0 ? 0 : (profit / revenue) * 100;

  if (margin >= 30) return "A";

  if (margin >= 20) return "B";

  if (margin >= 10) return "C";

  return "D";
}
