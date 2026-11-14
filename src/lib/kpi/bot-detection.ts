/**
 * Classify automated traffic so KPI totals count people, not robots.
 * Bot events are still stored (flagged) so the owner can review them.
 */

const BOT_PATTERN =
  /(bot|crawl|spider|slurp|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python-requests|python-urllib|axios|node-fetch|undici|go-http-client|java\/|okhttp|httpclient|scrapy|phantomjs|puppeteer|playwright|selenium|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|amazonbot|applebot|bingpreview|yandex|baidu|duckduck|chrome-lighthouse|gtmetrix|statuscake|site24x7|newrelic|datadog|netlify)/iu;

/** Real browsers update automatically; a Chrome this old is almost always a scripted client. */
const MIN_REAL_CHROME_MAJOR = 110;

export type BotVerdict = { isBot: boolean; reason: string | null };

export function classifyUserAgent(userAgent: string | null | undefined): BotVerdict {
  const ua = (userAgent ?? "").trim();
  if (!ua) return { isBot: true, reason: "missing_user_agent" };
  if (ua.length < 20 || !/mozilla|opera/iu.test(ua)) return { isBot: true, reason: "non_browser_user_agent" };
  const match = BOT_PATTERN.exec(ua);
  if (match) return { isBot: true, reason: `user_agent:${match[1].toLowerCase()}` };
  const chrome = /Chrome\/(\d+)\./u.exec(ua);
  if (chrome && Number(chrome[1]) < MIN_REAL_CHROME_MAJOR) return { isBot: true, reason: `outdated_chrome_${chrome[1]}` };
  return { isBot: false, reason: null };
}

/**
 * SQL predicate (Postgres) matching rows that are NOT robots. Applies the same
 * rules to rows stored before the is_bot flag existed.
 */
export const HUMAN_TRAFFIC_SQL = `(
  coalesce(metadata->>'is_bot', 'false') <> 'true'
  and user_agent is not null
  and length(user_agent) >= 20
  and user_agent ~* '(mozilla|opera)'
  and user_agent !~* '${BOT_PATTERN.source.replace(/'/gu, "''")}'
  and coalesce(nullif(substring(user_agent from 'Chrome/([0-9]+)\\.'), '')::int, 999) >= ${MIN_REAL_CHROME_MAJOR}
)`;
