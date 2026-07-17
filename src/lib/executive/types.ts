/**
 * Executive Analytics & KPI Dashboard — typed interfaces.
 *
 * All values are nullable / zero-safe so the UI can render safely
 * even when live data sources are not yet connected.
 *
 * Fields marked @integration-pending require external adapters.
 */

export type DataStatus = "live" | "demo" | "pending";

/** Wraps any metric value with provenance metadata. */
export interface MetricValue<T> {
  value: T;
  status: DataStatus;
  updatedAt: string | null;
}

export function metricPending<T>(fallback: T): MetricValue<T> {
  return { value: fallback, status: "pending", updatedAt: null };
}

export function metricDemo<T>(value: T): MetricValue<T> {
  return { value, status: "demo", updatedAt: new Date().toISOString() };
}

export function metricLive<T>(value: T): MetricValue<T> {
  return { value, status: "live", updatedAt: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Revenue KPIs
// ---------------------------------------------------------------------------

export interface RevenueKPIs {
  today: MetricValue<number>;
  yesterday: MetricValue<number>;
  weekToDate: MetricValue<number>;
  monthToDate: MetricValue<number>;
  yearToDate: MetricValue<number>;
  mrr: MetricValue<number>;
  arr: MetricValue<number>;
  recurringRevenue: MetricValue<number>;
  oneTimeRevenue: MetricValue<number>;
  refunds: MetricValue<number>;
  arpu: MetricValue<number>;
  ltv: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// Membership KPIs
// ---------------------------------------------------------------------------

export interface MembershipKPIs {
  total: MetricValue<number>;
  active: MetricValue<number>;
  inactive: MetricValue<number>;
  basicTier: MetricValue<number>;
  proTier: MetricValue<number>;
  goldTier: MetricValue<number>;
  trial: MetricValue<number>;
  renewals: MetricValue<number>;
  expired: MetricValue<number>;
  cancelled: MetricValue<number>;
  newToday: MetricValue<number>;
  monthlyChurn: MetricValue<number>;
  annualChurn: MetricValue<number>;
  growthRate: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// Financial KPIs
// ---------------------------------------------------------------------------

export interface FinancialKPIs {
  revenue: MetricValue<number>;
  expenses: MetricValue<number>;
  grossProfit: MetricValue<number>;
  netProfit: MetricValue<number>;
  cashPosition: MetricValue<number>;
  monthlyBurnRate: MetricValue<number>;
  operatingMargin: MetricValue<number>;
  grossMargin: MetricValue<number>;
  netMargin: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// Course KPIs
// ---------------------------------------------------------------------------

export interface CourseKPIs {
  mostPopular: MetricValue<string>;
  leastPopular: MetricValue<string>;
  mostViewedLesson: MetricValue<string>;
  avgCompletionRate: MetricValue<number>;
  avgTimePerLesson: MetricValue<number>;
  completionsToday: MetricValue<number>;
  quizAvgScore: MetricValue<number>;
  certificatesIssued: MetricValue<number>;
  avgRating: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// AI Coach KPIs
// ---------------------------------------------------------------------------

export interface AICoachKPIs {
  questionsAsked: MetricValue<number>;
  topTopics: MetricValue<string[]>;
  topLanguages: MetricValue<string[]>;
  failedSearches: MetricValue<number>;
  avgResponseTimeMs: MetricValue<number>;
  satisfactionRate: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// Marketing KPIs  @integration-pending: GA4, LinkedIn, Meta, YouTube
// ---------------------------------------------------------------------------

export interface MarketingKPIs {
  visitors: MetricValue<number>;
  conversions: MetricValue<number>;
  membershipSignups: MetricValue<number>;
  cpa: MetricValue<number>;
  cac: MetricValue<number>;
  roas: MetricValue<number>;
  organicSearch: MetricValue<number>;
  referralTraffic: MetricValue<number>;
  socialTraffic: MetricValue<number>;
}

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  latencyMs: number | null;
  checkedAt: string;
}

export interface SystemHealthKPIs {
  application: ServiceHealth;
  database: ServiceHealth;
  supabase: ServiceHealth;
  netlify: ServiceHealth;
  storage: MetricValue<number>;
  bandwidth: MetricValue<number>;
  apiHealth: ServiceHealth;
}

// ---------------------------------------------------------------------------
// Goal / KPI targets for "Know Your Numbers" page
// ---------------------------------------------------------------------------

export interface KPIGoal {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface KPIGoals {
  revenueGoal: KPIGoal;
  membershipGoal: KPIGoal;
  trafficGoal: KPIGoal;
  courseCompletionGoal: KPIGoal;
  customerSatisfactionGoal: KPIGoal;
  monthlyGrowthGoal: KPIGoal;
  annualGrowthGoal: KPIGoal;
  netProfitGoal: KPIGoal;
}

// ---------------------------------------------------------------------------
// Geographic breakdown
// ---------------------------------------------------------------------------

export interface GeoDataPoint {
  continent: string;
  country: string;
  countryCode: string;
  members: number;
  revenue: number;
  traffic: number;
  courseCompletions: number;
  aiUsage: number;
}

// ---------------------------------------------------------------------------
// Aggregate executive snapshot (landing dashboard)
// ---------------------------------------------------------------------------

export interface ExecutiveSnapshot {
  revenue: RevenueKPIs;
  membership: MembershipKPIs;
  financial: FinancialKPIs;
  courses: CourseKPIs;
  ai: AICoachKPIs;
  marketing: MarketingKPIs;
  system: SystemHealthKPIs;
  goals: KPIGoals;
  geo: GeoDataPoint[];
  generatedAt: string;
}
