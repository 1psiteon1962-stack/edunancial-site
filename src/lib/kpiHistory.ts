import { KPIRecord } from "./kpiTypes";

export interface KPIHistoryRecord {
  id: string;
  timestamp: string;
  region: string;
  country: string;
  language: string;
  revenue: number;
  profit: number;
}

export function createHistoryRecord(
  record: KPIRecord
): KPIHistoryRecord {
  return {
    id: record.id,
    timestamp: record.date,
    region: record.region,
    country: record.country,
    language: record.language,
    revenue: record.netRevenue,
    profit: record.netProfit,
  };
}
