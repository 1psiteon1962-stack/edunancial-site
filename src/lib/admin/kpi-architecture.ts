export type KpiStatus = "healthy" | "watch" | "critical" | "unknown";
export type KpiPeriod = "today" | "7d" | "30d" | "quarter" | "year" | "all-time";
export type KpiCategory = "revenue" | "customers" | "memberships" | "learning" | "growth" | "regional" | "tax" | "operations";

export interface ExecutiveKpi {
  id: string;
  label: string;
  category: KpiCategory;
  value: number | null;
  unit: "count" | "currency" | "percent" | "score";
  currency?: string;
  period: KpiPeriod;
  previousValue?: number | null;
  target?: number | null;
  status: KpiStatus;
  source: string;
  updatedAt?: string;
}

export interface RegionalKpi {
  regionCode: string;
  countryCode?: string;
  revenueMinor: number;
  customers: number;
  activeMembers: number;
  coursesSold: number;
  taxCollectedMinor: number;
  currency: string;
}

export interface ExecutiveDashboardSnapshot {
  generatedAt: string;
  period: KpiPeriod;
  kpis: ExecutiveKpi[];
  regional: RegionalKpi[];
  alerts: DashboardAlert[];
}

export interface DashboardAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  href?: string;
}

export const EXECUTIVE_KPI_DEFINITIONS = [
  { id: "gross-revenue", label: "Gross Revenue", category: "revenue", unit: "currency" },
  { id: "net-revenue", label: "Net Revenue", category: "revenue", unit: "currency" },
  { id: "mrr", label: "Monthly Recurring Revenue", category: "revenue", unit: "currency" },
  { id: "arr", label: "Annual Recurring Revenue", category: "revenue", unit: "currency" },
  { id: "active-members", label: "Active Members", category: "memberships", unit: "count" },
  { id: "new-members", label: "New Members", category: "memberships", unit: "count" },
  { id: "churn", label: "Membership Churn", category: "memberships", unit: "percent" },
  { id: "customers", label: "Total Customers", category: "customers", unit: "count" },
  { id: "conversion", label: "Visitor to Paid Conversion", category: "growth", unit: "percent" },
  { id: "courses-sold", label: "Courses Sold", category: "learning", unit: "count" },
  { id: "completion", label: "Course Completion", category: "learning", unit: "percent" },
  { id: "competency", label: "Average Competency Score", category: "learning", unit: "score" },
  { id: "countries", label: "Countries Served", category: "regional", unit: "count" },
  { id: "tax-collected", label: "Tax Collected", category: "tax", unit: "currency" },
  { id: "tax-jurisdictions", label: "Tax Jurisdictions Active", category: "tax", unit: "count" },
  { id: "failed-payments", label: "Failed Payments", category: "operations", unit: "count" },
] as const;
