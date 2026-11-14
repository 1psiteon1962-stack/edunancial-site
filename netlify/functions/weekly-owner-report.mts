import { buildWeeklyOwnerReport, postReportToGithub, saveWeeklyOwnerReport } from "../../src/lib/reports/weekly-owner-report";

/** Every Monday 15:07 UTC (7:07 a.m. Pacific): build, save and post the owner report. */
export default async function handler() {
  const { date, markdown } = await buildWeeklyOwnerReport();
  await saveWeeklyOwnerReport(date, markdown);
  const posted = await postReportToGithub(date, markdown).catch((error) => ({ posted: false, reason: String(error) }));
  console.log(JSON.stringify({ message: "weekly-owner-report.done", date, ...posted }));
  return new Response(null, { status: 204 });
}

export const config = { schedule: "7 15 * * 1" };
