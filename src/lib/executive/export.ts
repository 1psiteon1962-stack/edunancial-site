/**
 * Executive CSV export utilities.
 *
 * Typed interfaces are defined for Excel/PDF so future integrations
 * can implement them without changing the consumer code.
 */

import type { ExecutiveSnapshot } from "@/lib/executive/types";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function row(...cells: (string | number | null | undefined)[]): string {
  return cells
    .map((c) => {
      const s = c == null ? "" : String(c);
      return `"${s.replace(/"/g, '""')}"`;
    })
    .join(",");
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

export function buildExecutiveKPICsv(snapshot: ExecutiveSnapshot): string {
  const lines: string[] = [];

  lines.push(row("Section", "Metric", "Value", "Status", "Updated At"));

  const rev = snapshot.revenue;
  lines.push(row("Revenue", "Today", rev.today.value, rev.today.status, rev.today.updatedAt));
  lines.push(row("Revenue", "Yesterday", rev.yesterday.value, rev.yesterday.status, rev.yesterday.updatedAt));
  lines.push(row("Revenue", "Week to Date", rev.weekToDate.value, rev.weekToDate.status, rev.weekToDate.updatedAt));
  lines.push(row("Revenue", "Month to Date", rev.monthToDate.value, rev.monthToDate.status, rev.monthToDate.updatedAt));
  lines.push(row("Revenue", "Year to Date", rev.yearToDate.value, rev.yearToDate.status, rev.yearToDate.updatedAt));
  lines.push(row("Revenue", "MRR", rev.mrr.value, rev.mrr.status, rev.mrr.updatedAt));
  lines.push(row("Revenue", "ARR", rev.arr.value, rev.arr.status, rev.arr.updatedAt));
  lines.push(row("Revenue", "ARPU", rev.arpu.value, rev.arpu.status, rev.arpu.updatedAt));
  lines.push(row("Revenue", "LTV", rev.ltv.value, rev.ltv.status, rev.ltv.updatedAt));
  lines.push(row("Revenue", "Refunds", rev.refunds.value, rev.refunds.status, rev.refunds.updatedAt));

  const mem = snapshot.membership;
  lines.push(row("Membership", "Total", mem.total.value, mem.total.status, mem.total.updatedAt));
  lines.push(row("Membership", "Active", mem.active.value, mem.active.status, mem.active.updatedAt));
  lines.push(row("Membership", "New Today", mem.newToday.value, mem.newToday.status, mem.newToday.updatedAt));
  lines.push(row("Membership", "Basic Tier", mem.basicTier.value, mem.basicTier.status, mem.basicTier.updatedAt));
  lines.push(row("Membership", "Pro Tier", mem.proTier.value, mem.proTier.status, mem.proTier.updatedAt));
  lines.push(row("Membership", "Gold Tier", mem.goldTier.value, mem.goldTier.status, mem.goldTier.updatedAt));
  lines.push(row("Membership", "Monthly Churn %", mem.monthlyChurn.value, mem.monthlyChurn.status, mem.monthlyChurn.updatedAt));
  lines.push(row("Membership", "Annual Churn %", mem.annualChurn.value, mem.annualChurn.status, mem.annualChurn.updatedAt));
  lines.push(row("Membership", "Growth Rate %", mem.growthRate.value, mem.growthRate.status, mem.growthRate.updatedAt));

  const fin = snapshot.financial;
  lines.push(row("Financial", "Revenue", fin.revenue.value, fin.revenue.status, fin.revenue.updatedAt));
  lines.push(row("Financial", "Expenses", fin.expenses.value, fin.expenses.status, fin.expenses.updatedAt));
  lines.push(row("Financial", "Gross Profit", fin.grossProfit.value, fin.grossProfit.status, fin.grossProfit.updatedAt));
  lines.push(row("Financial", "Net Profit", fin.netProfit.value, fin.netProfit.status, fin.netProfit.updatedAt));
  lines.push(row("Financial", "Cash Position", fin.cashPosition.value, fin.cashPosition.status, fin.cashPosition.updatedAt));
  lines.push(row("Financial", "Gross Margin %", fin.grossMargin.value, fin.grossMargin.status, fin.grossMargin.updatedAt));
  lines.push(row("Financial", "Net Margin %", fin.netMargin.value, fin.netMargin.status, fin.netMargin.updatedAt));

  const crs = snapshot.courses;
  lines.push(row("Courses", "Most Popular", crs.mostPopular.value, crs.mostPopular.status, crs.mostPopular.updatedAt));
  lines.push(row("Courses", "Avg Completion Rate %", crs.avgCompletionRate.value, crs.avgCompletionRate.status, crs.avgCompletionRate.updatedAt));
  lines.push(row("Courses", "Completions Today", crs.completionsToday.value, crs.completionsToday.status, crs.completionsToday.updatedAt));
  lines.push(row("Courses", "Certificates Issued", crs.certificatesIssued.value, crs.certificatesIssued.status, crs.certificatesIssued.updatedAt));

  const mkt = snapshot.marketing;
  lines.push(row("Marketing", "Visitors", mkt.visitors.value, mkt.visitors.status, mkt.visitors.updatedAt));
  lines.push(row("Marketing", "Conversions", mkt.conversions.value, mkt.conversions.status, mkt.conversions.updatedAt));
  lines.push(row("Marketing", "Membership Signups", mkt.membershipSignups.value, mkt.membershipSignups.status, mkt.membershipSignups.updatedAt));
  lines.push(row("Marketing", "CAC", mkt.cac.value, mkt.cac.status, mkt.cac.updatedAt));
  lines.push(row("Marketing", "ROAS", mkt.roas.value, mkt.roas.status, mkt.roas.updatedAt));

  lines.push(row("Generated At", "", snapshot.generatedAt, "live", snapshot.generatedAt));

  return lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// Export interfaces for future Excel/PDF integrations
// ---------------------------------------------------------------------------

/** @integration-pending: implement with exceljs or similar */
export interface ExcelExporter {
  buildExecutiveKPIWorkbook(snapshot: ExecutiveSnapshot): Promise<Buffer>;
}

/** @integration-pending: implement with pdfkit or puppeteer */
export interface PDFExporter {
  buildExecutiveKPIReport(snapshot: ExecutiveSnapshot): Promise<Buffer>;
}
