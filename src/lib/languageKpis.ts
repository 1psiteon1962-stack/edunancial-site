import { KPIRecord } from "./kpiTypes";

export interface LanguageKPI {
  language: string;
  revenue: number;
  profit: number;
  users: number;
}

export function summarizeLanguage(
  language: string,
  records: KPIRecord[]
): LanguageKPI {

  const filtered = records.filter(
    (record) => record.language === language
  );

  return {
    language,
    revenue: filtered.reduce((t, r) => t + r.netRevenue, 0),
    profit: filtered.reduce((t, r) => t + r.netProfit, 0),
    users: filtered.reduce((t, r) => t + r.activeUsers, 0),
  };

}
