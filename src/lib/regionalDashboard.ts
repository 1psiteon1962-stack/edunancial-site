import { KPIRecord } from "./kpiTypes";

export interface RegionalDashboard {
  region: string;
  revenue: number;
  profit: number;
  profitMargin: number;
  activeUsers: number;
  newUsers: number;
  downloads: number;
  courseEnrollments: number;
  courseCompletions: number;
}

export function buildRegionalDashboard(
  region: string,
  records: KPIRecord[]
): RegionalDashboard {
  const filtered = records.filter(
    (record) => record.region === region
  );

  const revenue = filtered.reduce(
    (total, record) => total + record.netRevenue,
    0
  );

  const profit = filtered.reduce(
    (total, record) => total + record.netProfit,
    0
  );

  return {
    region,
    revenue,
    profit,
    profitMargin:
      revenue === 0
        ? 0
        : Number(((profit / revenue) * 100).toFixed(2)),
    activeUsers: filtered.reduce(
      (total, record) => total + record.activeUsers,
      0
    ),
    newUsers: filtered.reduce(
      (total, record) => total + record.newUsers,
      0
    ),
    downloads: filtered.reduce(
      (total, record) => total + record.downloads,
      0
    ),
    courseEnrollments: filtered.reduce(
      (total, record) => total + record.courseEnrollments,
      0
    ),
    courseCompletions: filtered.reduce(
      (total, record) => total + record.courseCompletions,
      0
    ),
  };
}
``
