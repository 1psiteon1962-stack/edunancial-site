/** Executive Analytics Data Adapters */
import {
  type AICoachKPIs, type CourseKPIs, type ExecutiveSnapshot, type FinancialKPIs,
  type GeoDataPoint, type KPIGoal, type KPIGoals, type MarketingKPIs,
  type MembershipKPIs, type RevenueKPIs, type ServiceHealth, type SystemHealthKPIs,
  metricDemo, metricLive, metricPending,
} from "@/lib/executive/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getRevenueKPIs(): Promise<RevenueKPIs> {
  return { today: metricPending(0), yesterday: metricPending(0), weekToDate: metricPending(0), monthToDate: metricPending(0), yearToDate: metricPending(0), mrr: metricPending(0), arr: metricPending(0), recurringRevenue: metricPending(0), oneTimeRevenue: metricPending(0), refunds: metricPending(0), arpu: metricPending(0), ltv: metricPending(0) };
}

export async function getMembershipKPIs(): Promise<MembershipKPIs> {
  return { total: metricPending(0), active: metricPending(0), inactive: metricPending(0), basicTier: metricPending(0), proTier: metricPending(0), goldTier: metricPending(0), trial: metricPending(0), renewals: metricPending(0), expired: metricPending(0), cancelled: metricPending(0), newToday: metricPending(0), monthlyChurn: metricPending(0), annualChurn: metricPending(0), growthRate: metricPending(0) };
}

export async function getFinancialKPIs(): Promise<FinancialKPIs> {
  return { revenue: metricPending(0), expenses: metricPending(0), grossProfit: metricPending(0), netProfit: metricPending(0), cashPosition: metricPending(0), monthlyBurnRate: metricPending(0), operatingMargin: metricPending(0), grossMargin: metricPending(0), netMargin: metricPending(0) };
}

export async function getCourseKPIs(): Promise<CourseKPIs> {
  return { mostPopular: metricPending("—"), leastPopular: metricPending("—"), mostViewedLesson: metricPending("—"), avgCompletionRate: metricPending(0), avgTimePerLesson: metricPending(0), completionsToday: metricPending(0), quizAvgScore: metricPending(0), certificatesIssued: metricPending(0), avgRating: metricPending(0) };
}

export async function getAICoachKPIs(): Promise<AICoachKPIs> {
  return { questionsAsked: metricPending(0), topTopics: metricPending([]), topLanguages: metricPending([]), failedSearches: metricPending(0), avgResponseTimeMs: metricPending(0), satisfactionRate: metricPending(0) };
}

function startOfMonthIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function getMarketingKPIs(): Promise<MarketingKPIs> {
  try {
    const db = getSupabaseAdminClient();
    const since = startOfMonthIso();
    const [{ data: events, error: eventError }, { data: spendRows, error: spendError }] = await Promise.all([
      db.from("kpi_events").select("event_name,session_id,referrer,utm_source,utm_medium,value").gte("created_at", since),
      db.from("kpi_marketing_spend").select("amount").gte("spend_date", since.slice(0, 10)),
    ]);
    if (eventError) throw eventError;

    const rows = events ?? [];
    const pageViews = rows.filter((row) => row.event_name === "page_view");
    const sessions = new Set(pageViews.map((row) => row.session_id).filter(Boolean));
    const signups = rows.filter((row) => row.event_name === "signup");
    const purchases = rows.filter((row) => row.event_name === "purchase");
    const revenue = purchases.reduce((sum, row) => sum + Number(row.value ?? 0), 0);
    const conversions = purchases.length;
    const organic = pageViews.filter((row) => row.utm_medium === "organic" || row.utm_source === "google" || row.utm_source === "bing").length;
    const social = pageViews.filter((row) => ["social", "paid_social"].includes(String(row.utm_medium ?? ""))).length;
    const referrals = pageViews.filter((row) => Boolean(row.referrer) && !String(row.referrer).includes("edunancial.com")).length;

    const spendAvailable = !spendError;
    const spend = spendAvailable ? (spendRows ?? []).reduce((sum, row) => sum + Number(row.amount ?? 0), 0) : 0;
    const cac = spendAvailable && conversions > 0 ? spend / conversions : 0;
    const cpa = spendAvailable && signups.length > 0 ? spend / signups.length : 0;
    const roas = spendAvailable && spend > 0 ? revenue / spend : 0;

    return {
      visitors: metricLive(sessions.size),
      conversions: metricLive(conversions),
      membershipSignups: metricLive(signups.length),
      cpa: spendAvailable ? metricLive(cpa) : metricPending(0),
      cac: spendAvailable ? metricLive(cac) : metricPending(0),
      roas: spendAvailable ? metricLive(roas) : metricPending(0),
      organicSearch: metricLive(organic),
      referralTraffic: metricLive(referrals),
      socialTraffic: metricLive(social),
    };
  } catch (error) {
    console.error("getMarketingKPIs failed", error);
    return { visitors: metricPending(0), conversions: metricPending(0), membershipSignups: metricPending(0), cpa: metricPending(0), cac: metricPending(0), roas: metricPending(0), organicSearch: metricPending(0), referralTraffic: metricPending(0), socialTraffic: metricPending(0) };
  }
}

function unknownService(name: string): ServiceHealth { return { name, status: "unknown", latencyMs: null, checkedAt: new Date().toISOString() }; }
export async function getSystemHealthKPIs(): Promise<SystemHealthKPIs> {
  return { application: unknownService("Application"), database: unknownService("Database"), supabase: unknownService("Supabase"), netlify: unknownService("Netlify"), storage: metricPending(0), bandwidth: metricPending(0), apiHealth: unknownService("API") };
}
function defaultGoal(label: string, target: number, unit: string): KPIGoal { return { label, current: 0, target, unit }; }
export async function getKPIGoals(): Promise<KPIGoals> {
  return { revenueGoal: defaultGoal("Monthly Revenue Goal", 10000, "USD"), membershipGoal: defaultGoal("Active Members Goal", 1000, "members"), trafficGoal: defaultGoal("Monthly Traffic Goal", 50000, "visitors"), courseCompletionGoal: defaultGoal("Course Completion Goal", 500, "completions"), customerSatisfactionGoal: defaultGoal("Customer Satisfaction Goal", 90, "%"), monthlyGrowthGoal: defaultGoal("Monthly Growth Goal", 10, "%"), annualGrowthGoal: defaultGoal("Annual Growth Goal", 100, "%"), netProfitGoal: defaultGoal("Monthly Net Profit Goal", 5000, "USD") };
}
export async function getGeoData(): Promise<GeoDataPoint[]> {
  return [metricDemo({ continent: "North America", country: "United States", countryCode: "US", members: 0, revenue: 0, traffic: 0, courseCompletions: 0, aiUsage: 0 }).value];
}
export async function getExecutiveSnapshot(): Promise<ExecutiveSnapshot> {
  const [revenue, membership, financial, courses, ai, marketing, system, goals, geo] = await Promise.all([getRevenueKPIs(), getMembershipKPIs(), getFinancialKPIs(), getCourseKPIs(), getAICoachKPIs(), getMarketingKPIs(), getSystemHealthKPIs(), getKPIGoals(), getGeoData()]);
  return { revenue, membership, financial, courses, ai, marketing, system, goals, geo, generatedAt: new Date().toISOString() };
}
