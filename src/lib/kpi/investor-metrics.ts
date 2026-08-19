export type MetricStatus = "LIVE" | "UNAVAILABLE" | "ESTIMATED";

export interface InvestorMetric {
  key: string;
  label: string;
  value: number | null;
  unit: "USD" | "PERCENT" | "COUNT" | "MONTHS";
  status: MetricStatus;
  source: string | null;
  asOf: string;
}

export interface TaxLiabilitySnapshot {
  salesTaxCollected: number | null;
  salesTaxRemitted: number | null;
  salesTaxDue: number | null;
  incomeTaxProvision: number | null;
  payrollTaxDue: number | null;
  franchiseAndOtherTaxDue: number | null;
  totalBusinessTaxDue: number | null;
  nextFilingDueAt: string | null;
  jurisdictionsDue: number | null;
  status: MetricStatus;
  asOf: string;
}

export interface InvestorDashboardSnapshot {
  revenue: {
    grossRevenue: InvestorMetric;
    netRevenue: InvestorMetric;
    mrr: InvestorMetric;
    arr: InvestorMetric;
    revenueGrowth: InvestorMetric;
    recurringRevenuePercent: InvestorMetric;
    averageRevenuePerCustomer: InvestorMetric;
  };
  profitability: {
    grossMargin: InvestorMetric;
    operatingExpenses: InvestorMetric;
    ebitda: InvestorMetric;
    ebitdaMargin: InvestorMetric;
    netIncome: InvestorMetric;
    cashBalance: InvestorMetric;
    monthlyBurn: InvestorMetric;
    runway: InvestorMetric;
  };
  growth: {
    activeMembers: InvestorMetric;
    newMembers30d: InvestorMetric;
    churn: InvestorMetric;
    conversion: InvestorMetric;
    cac: InvestorMetric;
    ltv: InvestorMetric;
    ltvCacRatio: InvestorMetric;
    coursesSold: InvestorMetric;
    courseCompletion: InvestorMetric;
  };
  taxes: TaxLiabilitySnapshot;
  operations: {
    countriesActive: InvestorMetric;
    countriesPrivate: InvestorMetric;
    failedPayments: InvestorMetric;
    refunds: InvestorMetric;
    taxJurisdictionsActive: InvestorMetric;
  };
}

export const INVESTOR_DASHBOARD_REQUIREMENTS = {
  principles: [
    "Never represent a disconnected data source as zero.",
    "Every live metric must identify its authoritative source and as-of time.",
    "Tax collected is a liability until remitted and must not be counted as revenue.",
    "Sales-tax liability must reconcile collected minus remitted plus adjustments.",
    "Total business tax due must separately identify sales/consumption, income, payroll, franchise and other taxes.",
    "Historical KPI snapshots must be retained so diligence trends can be reproduced.",
  ],
  diligenceCategories: [
    "Revenue quality and recurring revenue",
    "Growth and retention",
    "Unit economics",
    "Profitability and cash runway",
    "Tax liabilities and filing exposure",
    "Geographic concentration",
    "Customer and product concentration",
    "Refunds, failed payments and chargebacks",
    "Learning/product engagement",
    "Operational and compliance readiness",
  ],
} as const;
