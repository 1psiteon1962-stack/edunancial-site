/**
 * Executive Analytics Data Adapters
 *
 * Each function returns typed MetricValue objects with safe fallbacks.
 * When a live data source is connected, replace the metricPending() /
 * metricDemo() call with the real data fetch and wrap in metricLive().
 *
 * Extension points are clearly marked with @integration-pending comments.
 */

import {
  type AICoachKPIs,
  type CourseKPIs,
  type ExecutiveSnapshot,
  type FinancialKPIs,
  type GeoDataPoint,
  type KPIGoal,
  type KPIGoals,
  type MarketingKPIs,
  type MembershipKPIs,
  type RevenueKPIs,
  type ServiceHealth,
  type SystemHealthKPIs,
  metricDemo,
  metricPending,
} from "@/lib/executive/types";

// ---------------------------------------------------------------------------
// Revenue
// @integration-pending: Square / Stripe / payment provider webhooks
// ---------------------------------------------------------------------------

export async function getRevenueKPIs(): Promise<RevenueKPIs> {
  return {
    today: metricPending(0),
    yesterday: metricPending(0),
    weekToDate: metricPending(0),
    monthToDate: metricPending(0),
    yearToDate: metricPending(0),
    mrr: metricPending(0),
    arr: metricPending(0),
    recurringRevenue: metricPending(0),
    oneTimeRevenue: metricPending(0),
    refunds: metricPending(0),
    arpu: metricPending(0),
    ltv: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// Membership
// @integration-pending: Supabase members table / subscription records
// ---------------------------------------------------------------------------

export async function getMembershipKPIs(): Promise<MembershipKPIs> {
  return {
    total: metricPending(0),
    active: metricPending(0),
    inactive: metricPending(0),
    basicTier: metricPending(0),
    proTier: metricPending(0),
    goldTier: metricPending(0),
    trial: metricPending(0),
    renewals: metricPending(0),
    expired: metricPending(0),
    cancelled: metricPending(0),
    newToday: metricPending(0),
    monthlyChurn: metricPending(0),
    annualChurn: metricPending(0),
    growthRate: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// Financial
// @integration-pending: accounting integration (QuickBooks / Xero / manual)
// ---------------------------------------------------------------------------

export async function getFinancialKPIs(): Promise<FinancialKPIs> {
  return {
    revenue: metricPending(0),
    expenses: metricPending(0),
    grossProfit: metricPending(0),
    netProfit: metricPending(0),
    cashPosition: metricPending(0),
    monthlyBurnRate: metricPending(0),
    operatingMargin: metricPending(0),
    grossMargin: metricPending(0),
    netMargin: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// Courses
// @integration-pending: Supabase course_progress / enrollments tables
// ---------------------------------------------------------------------------

export async function getCourseKPIs(): Promise<CourseKPIs> {
  return {
    mostPopular: metricPending("—"),
    leastPopular: metricPending("—"),
    mostViewedLesson: metricPending("—"),
    avgCompletionRate: metricPending(0),
    avgTimePerLesson: metricPending(0),
    completionsToday: metricPending(0),
    quizAvgScore: metricPending(0),
    certificatesIssued: metricPending(0),
    avgRating: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// AI Coach
// @integration-pending: AI coach conversation logs / Supabase ai_conversations
// ---------------------------------------------------------------------------

export async function getAICoachKPIs(): Promise<AICoachKPIs> {
  return {
    questionsAsked: metricPending(0),
    topTopics: metricPending([]),
    topLanguages: metricPending([]),
    failedSearches: metricPending(0),
    avgResponseTimeMs: metricPending(0),
    satisfactionRate: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// Marketing
// @integration-pending: GA4, LinkedIn Ads, Meta Ads, YouTube Analytics
// ---------------------------------------------------------------------------

export async function getMarketingKPIs(): Promise<MarketingKPIs> {
  return {
    visitors: metricPending(0),
    conversions: metricPending(0),
    membershipSignups: metricPending(0),
    cpa: metricPending(0),
    cac: metricPending(0),
    roas: metricPending(0),
    organicSearch: metricPending(0),
    referralTraffic: metricPending(0),
    socialTraffic: metricPending(0),
  };
}

// ---------------------------------------------------------------------------
// System Health
// @integration-pending: Supabase health API, Netlify status API, uptime checks
// ---------------------------------------------------------------------------

function unknownService(name: string): ServiceHealth {
  return { name, status: "unknown", latencyMs: null, checkedAt: new Date().toISOString() };
}

export async function getSystemHealthKPIs(): Promise<SystemHealthKPIs> {
  return {
    application: unknownService("Application"),
    database: unknownService("Database"),
    supabase: unknownService("Supabase"),
    netlify: unknownService("Netlify"),
    storage: metricPending(0),
    bandwidth: metricPending(0),
    apiHealth: unknownService("API"),
  };
}

// ---------------------------------------------------------------------------
// KPI Goals  (owner-configurable — @integration-pending: persist in Supabase)
// ---------------------------------------------------------------------------

function defaultGoal(label: string, target: number, unit: string): KPIGoal {
  return { label, current: 0, target, unit };
}

export async function getKPIGoals(): Promise<KPIGoals> {
  return {
    revenueGoal: defaultGoal("Monthly Revenue Goal", 10000, "USD"),
    membershipGoal: defaultGoal("Active Members Goal", 1000, "members"),
    trafficGoal: defaultGoal("Monthly Traffic Goal", 50000, "visitors"),
    courseCompletionGoal: defaultGoal("Course Completion Goal", 500, "completions"),
    customerSatisfactionGoal: defaultGoal("Customer Satisfaction Goal", 90, "%"),
    monthlyGrowthGoal: defaultGoal("Monthly Growth Goal", 10, "%"),
    annualGrowthGoal: defaultGoal("Annual Growth Goal", 100, "%"),
    netProfitGoal: defaultGoal("Monthly Net Profit Goal", 5000, "USD"),
  };
}

// ---------------------------------------------------------------------------
// Geographic data  @integration-pending: Supabase geo_analytics / IP lookup
// ---------------------------------------------------------------------------

export async function getGeoData(): Promise<GeoDataPoint[]> {
  return [
    metricDemo({
      continent: "North America",
      country: "United States",
      countryCode: "US",
      members: 0,
      revenue: 0,
      traffic: 0,
      courseCompletions: 0,
      aiUsage: 0,
    }).value,
  ];
}

// ---------------------------------------------------------------------------
// Aggregate snapshot (used by the landing dashboard)
// ---------------------------------------------------------------------------

export async function getExecutiveSnapshot(): Promise<ExecutiveSnapshot> {
  const [revenue, membership, financial, courses, ai, marketing, system, goals, geo] =
    await Promise.all([
      getRevenueKPIs(),
      getMembershipKPIs(),
      getFinancialKPIs(),
      getCourseKPIs(),
      getAICoachKPIs(),
      getMarketingKPIs(),
      getSystemHealthKPIs(),
      getKPIGoals(),
      getGeoData(),
    ]);

  return {
    revenue,
    membership,
    financial,
    courses,
    ai,
    marketing,
    system,
    goals,
    geo,
    generatedAt: new Date().toISOString(),
  };
}
