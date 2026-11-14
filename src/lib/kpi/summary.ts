import { getNeonSql } from "@/lib/db/neon";
import { HUMAN_TRAFFIC_SQL } from "@/lib/kpi/bot-detection";

/**
 * Owner analytics summary from the Neon kpi_events store (where every event is
 * written). Robots are excluded from visitor totals and reported separately.
 */

export type CountRow = { key: string; count: number };
export type DailyRow = { day: string; visitors: number; pageViews: number; signups: number };

export interface KpiSummary {
  generatedAt: string;
  windowDays: number;
  totals: {
    visitorsToday: number;
    visitorsWeek: number;
    visitorsMonth: number;
    visitorsWindow: number;
    pageViewsWindow: number;
    robotViewsWindow: number;
    signupsWindow: number;
    lessonStartsWindow: number;
    lessonCompletionsWindow: number;
  };
  spending: {
    purchases: number;
    revenue: number;
    buyers: number;
    averagePurchase: number;
    averagePerBuyer: number;
    currency: string;
    topBuyers: Array<{ userId: string; purchases: number; total: number }>;
  };
  daily: DailyRow[];
  countries: CountRow[];
  siteLanguages: CountRow[];
  deviceLanguages: CountRow[];
  pages: CountRow[];
  sources: CountRow[];
  campaigns: CountRow[];
  devices: CountRow[];
  robotReasons: CountRow[];
}

type Row = Record<string, unknown>;
const num = (value: unknown) => (typeof value === "number" ? value : Number(value ?? 0)) || 0;
const VISITOR = "coalesce(metadata->>'visitor_id', session_id, ip_hash)";

export async function getKpiSummary(windowDays = 30): Promise<KpiSummary> {
  const sql = getNeonSql();
  if (!sql) throw new Error("Analytics database is not configured.");
  const days = Math.max(1, Math.min(366, Math.trunc(windowDays)));
  const since = `now() - make_interval(days => $1)`;
  const human = HUMAN_TRAFFIC_SQL;
  const q = async (text: string, params: unknown[] = [days]) => (await sql.query(text, params)) as Row[];
  const top = (expr: string, where: string, limit = 15) =>
    q(
      `select ${expr} as key, count(*)::int as count from kpi_events
       where created_at >= ${since} and ${where} and ${expr} is not null and ${expr} <> ''
       group by 1 order by 2 desc limit ${limit}`,
    ).then((rows) => rows.map((r) => ({ key: String(r.key), count: num(r.count) })));

  const pv = `event_name = 'page_view' and ${human}`;

  const [totalsRows, daily, countries, siteLanguages, deviceLanguages, pages, sources, campaigns, devices, robotReasons, spendRows, topBuyers] =
    await Promise.all([
      q(`select
          count(distinct ${VISITOR}) filter (where ${pv} and created_at >= date_trunc('day', now()))::int as today,
          count(distinct ${VISITOR}) filter (where ${pv} and created_at >= now() - interval '7 days')::int as week,
          count(distinct ${VISITOR}) filter (where ${pv} and created_at >= date_trunc('month', now()))::int as month,
          count(distinct ${VISITOR}) filter (where ${pv} and created_at >= ${since})::int as win_visitors,
          count(*) filter (where ${pv} and created_at >= ${since})::int as win_views,
          count(*) filter (where event_name = 'page_view' and not ${human} and created_at >= ${since})::int as robot_views,
          count(*) filter (where event_name = 'signup' and created_at >= ${since})::int as signups,
          count(*) filter (where event_name = 'lesson_start' and created_at >= ${since})::int as starts,
          count(*) filter (where event_name = 'lesson_complete' and created_at >= ${since})::int as completions
        from kpi_events where created_at >= least(${since}, date_trunc('month', now()), now() - interval '7 days')`),
      q(`select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
          count(distinct ${VISITOR}) filter (where ${pv})::int as visitors,
          count(*) filter (where ${pv})::int as views,
          count(*) filter (where event_name = 'signup')::int as signups
        from kpi_events where created_at >= ${since} group by 1 order by 1`),
      top("metadata->>'visitor_country_code'", pv, 30),
      top("metadata->>'site_locale'", pv),
      top("coalesce(metadata->>'accept_language', metadata->>'browser_language')", pv),
      top("path", pv, 20),
      top(
        `coalesce(nullif(utm_source, ''), case when referrer is null or referrer = '' then '(direct)' when referrer ilike '%edunancial.com%' then null else substring(referrer from '^https?://([^/]+)') end)`,
        pv,
      ),
      top("utm_campaign", pv),
      top("metadata->>'screen'", pv),
      top("coalesce(metadata->>'bot_reason', 'pattern_match')", `event_name = 'page_view' and not ${human}`),
      q(`select count(*)::int as purchases, coalesce(sum(value), 0)::float as revenue,
          count(distinct user_id)::int as buyers, max(currency) as currency
        from kpi_events where event_name = 'purchase' and created_at >= ${since}`),
      q(`select user_id, count(*)::int as purchases, coalesce(sum(value), 0)::float as total
        from kpi_events where event_name = 'purchase' and user_id is not null and created_at >= ${since}
        group by 1 order by 3 desc limit 10`),
    ]);

  const t = totalsRows[0] ?? {};
  const s = spendRows[0] ?? {};
  const purchases = num(s.purchases);
  const revenue = num(s.revenue);
  const buyers = num(s.buyers);

  return {
    generatedAt: new Date().toISOString(),
    windowDays: days,
    totals: {
      visitorsToday: num(t.today),
      visitorsWeek: num(t.week),
      visitorsMonth: num(t.month),
      visitorsWindow: num(t.win_visitors),
      pageViewsWindow: num(t.win_views),
      robotViewsWindow: num(t.robot_views),
      signupsWindow: num(t.signups),
      lessonStartsWindow: num(t.starts),
      lessonCompletionsWindow: num(t.completions),
    },
    spending: {
      purchases,
      revenue,
      buyers,
      averagePurchase: purchases ? revenue / purchases : 0,
      averagePerBuyer: buyers ? revenue / buyers : 0,
      currency: String(s.currency ?? "USD"),
      topBuyers: topBuyers.map((r) => ({ userId: String(r.user_id), purchases: num(r.purchases), total: num(r.total) })),
    },
    daily: daily.map((r) => ({ day: String(r.day), visitors: num(r.visitors), pageViews: num(r.views), signups: num(r.signups) })),
    countries,
    siteLanguages,
    deviceLanguages,
    pages,
    sources,
    campaigns,
    devices,
    robotReasons,
  };
}
