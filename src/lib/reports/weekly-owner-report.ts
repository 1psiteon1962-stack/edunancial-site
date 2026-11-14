import { getStore } from "@netlify/blobs";

import { getKpiSummary, type CountRow } from "@/lib/kpi/summary";
import { listSecurityEvents } from "@/lib/security/login-guard";

/**
 * Weekly owner report: real visitors, where they came from, languages,
 * signups, learning, spending, robots, and security events. Saved to Netlify
 * Blobs (shown on /admin/reports) and posted as a GitHub issue so GitHub
 * emails the owner.
 */

export const REPORT_STORE = "owner-reports";

let regionNames: Intl.DisplayNames | null = null;
let languageNames: Intl.DisplayNames | null = null;
const country = (code: string) => {
  try { regionNames ??= new Intl.DisplayNames(["en"], { type: "region" }); return regionNames.of(code) ?? code; } catch { return code; }
};
const language = (code: string) => {
  try { languageNames ??= new Intl.DisplayNames(["en"], { type: "language" }); return languageNames.of(code) ?? code; } catch { return code; }
};
const n = (value: number) => value.toLocaleString("en-US");
const list = (rows: CountRow[], label: (k: string) => string = (k) => k, max = 8) =>
  rows.length ? rows.slice(0, max).map((r) => `- ${label(r.key)}: ${n(r.count)}`).join("\n") : "- none yet";

export async function buildWeeklyOwnerReport(now = new Date()) {
  const summary = await getKpiSummary(7);
  const sinceIso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let security: Awaited<ReturnType<typeof listSecurityEvents>> = [];
  let securityNote = "";
  try {
    security = (await listSecurityEvents(sinceIso)).filter((e) => e.at >= sinceIso);
  } catch (error) {
    securityNote = ` (security log unavailable: ${error instanceof Error ? error.message : "error"})`;
  }
  const failures = security.filter((e) => e.type === "login_failure").length;
  const locks = security.filter((e) => e.type === "login_locked");
  const successes = security.filter((e) => e.type === "login_success").length;
  const failureCountries = new Map<string, number>();
  for (const e of security) if (e.type !== "login_success") failureCountries.set(e.country ?? "unknown", (failureCountries.get(e.country ?? "unknown") ?? 0) + 1);
  const s = summary.spending;
  const money = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: /^[A-Z]{3}$/u.test(s.currency) ? s.currency : "USD" });
  const date = now.toISOString().slice(0, 10);

  const markdown = `# Edunancial weekly report — week ending ${date}

## People
- Real visitors (7 days): **${n(summary.totals.visitorsWeek)}**
- Pages viewed by people: ${n(summary.totals.pageViewsWindow)}
- Robot page views (excluded): ${n(summary.totals.robotViewsWindow)}
- Signups: **${n(summary.totals.signupsWindow)}**
- Lessons started: ${n(summary.totals.lessonStartsWindow)} · completed: ${n(summary.totals.lessonCompletionsWindow)}

## Visitors per day
${summary.daily.map((d) => `- ${d.day}: ${n(d.visitors)} visitors, ${n(d.signups)} signups`).join("\n") || "- none"}

## Where they came from (country)
${list(summary.countries, (k) => `${country(k)} (${k})`)}

## How they found the site
${list(summary.sources)}

## Language chosen on the site
${list(summary.siteLanguages, (k) => `${language(k)} (${k})`)}

## Device language
${list(summary.deviceLanguages, (k) => `${language(k)} (${k})`)}

## Most viewed pages
${list(summary.pages, (k) => k, 10)}

## Spending
${s.purchases ? `- Total: **${money(s.revenue)}** from ${n(s.purchases)} purchases by ${n(s.buyers)} buyers
- Average purchase: ${money(s.averagePurchase)} · average per buyer: ${money(s.averagePerBuyer)}` : "- No purchases recorded yet (payments not connected)."}

## Security${securityNote}
- Failed logins: ${n(failures)} · lockouts: ${n(locks.length)} · successful admin/owner logins: ${n(successes)}
${failureCountries.size ? `- Failed attempts by country: ${[...failureCountries.entries()].sort((a, b) => b[1] - a[1]).map(([c, k]) => `${c === "unknown" ? "unknown" : country(c)} ${k}`).join(", ")}` : "- No failed attempts."}
${locks.length ? locks.slice(0, 10).map((l) => `- LOCKED ${l.scope} ${l.account ?? "(address)"} at ${l.at}`).join("\n") : ""}

Full dashboard: https://edunancial.com/admin/kpi
`;
  return { date, markdown, summary };
}

export async function saveWeeklyOwnerReport(date: string, markdown: string) {
  const store = getStore({ name: REPORT_STORE, consistency: "strong" });
  await store.set(`weekly/${date}.md`, markdown);
  await store.set("weekly/latest.md", markdown);
}

export async function listWeeklyOwnerReports() {
  const store = getStore({ name: REPORT_STORE, consistency: "strong" });
  const { blobs } = await store.list({ prefix: "weekly/" });
  const keys = blobs.map((b) => b.key).filter((k) => /weekly\/\d{4}-\d{2}-\d{2}\.md$/u.test(k)).sort().reverse();
  const latest = keys[0] ? await store.get(keys[0]) : null;
  return { dates: keys.map((k) => k.slice(7, 17)), latest: latest ?? null };
}

export async function postReportToGithub(date: string, markdown: string) {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN?.trim();
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER?.trim() || "1psiteon1962-stack";
  const repo = process.env.EDUNANCIAL_GITHUB_REPO?.trim() || "edunancial-site";
  if (!token) return { posted: false, reason: "EDUNANCIAL_GITHUB_TOKEN not set" };
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "edunancial-weekly-report" },
    body: JSON.stringify({ title: `Weekly report — week ending ${date}`, body: markdown, labels: ["weekly-report"] }),
  });
  if (!response.ok) return { posted: false, reason: `GitHub ${response.status}: ${(await response.text()).slice(0, 200)}` };
  const issue = (await response.json()) as { html_url?: string };
  return { posted: true, url: issue.html_url ?? null };
}
