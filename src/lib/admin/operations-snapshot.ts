import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export type LiveValue = {
  value: number | null;
  status: "LIVE" | "UNAVAILABLE";
  source: string;
};

export interface ExecutiveOperationsSnapshot {
  asOf: string;
  grossRevenue: LiveValue;
  netRevenue: LiveValue;
  activeMembers: LiveValue;
  newMembers30d: LiveValue;
  failedPayments: LiveValue;
  refunds: LiveValue;
  salesTaxCollected: LiveValue;
  salesTaxRemitted: LiveValue;
  salesTaxDue: LiveValue;
  totalBusinessTaxDue: LiveValue;
  taxJurisdictionsDue: LiveValue;
  upload: {
    status: "READY" | "BLOCKED";
    signedUploadConfigured: boolean;
    fallbackAvailable: boolean;
    githubPublishingConfigured: boolean;
    problems: string[];
  };
}

type PaymentRow = {
  amount: number | string | null;
  status: string | null;
  currency: string | null;
};

type TaxRow = {
  country_code: string;
  jurisdiction_code: string | null;
  tax_type: string;
  tax_collected: number | string | null;
  tax_remitted: number | string | null;
  tax_accrued: number | string | null;
  adjustments: number | string | null;
  amount_due: number | string | null;
};

const live = (value: number | null, source: string): LiveValue => ({
  value,
  status: value === null ? "UNAVAILABLE" : "LIVE",
  source,
});

const num = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function getExecutiveOperationsSnapshot(): Promise<ExecutiveOperationsSnapshot> {
  const asOf = new Date().toISOString();
  const unavailable = (source: string) => live(null, source);
  const signedUploadConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      (process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET?.trim() ||
        process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY?.trim()),
  );
  const githubPublishingConfigured = Boolean(
    process.env.EDUNANCIAL_GITHUB_TOKEN?.trim() &&
      process.env.EDUNANCIAL_GITHUB_OWNER?.trim() &&
      process.env.EDUNANCIAL_GITHUB_REPO?.trim(),
  );
  const fallbackAvailable = process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const problems: string[] = [];

  if (!signedUploadConfigured) problems.push("Signed upload configuration incomplete.");
  if (!githubPublishingConfigured) problems.push("GitHub publishing configuration incomplete.");

  try {
    const db = getKpiSupabaseAdmin();
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString();

    const [paymentsResult, membersResult, newMembersResult, taxResult] = await Promise.all([
      db.from("payment_transactions").select("amount,status,currency"),
      db.from("members").select("id", { count: "exact", head: true }).eq("active", true),
      db.from("members").select("id", { count: "exact", head: true }).gte("created_at", since),
      db
        .from("business_tax_ledger")
        .select("country_code,jurisdiction_code,tax_type,tax_collected,tax_remitted,tax_accrued,adjustments,amount_due"),
    ]);

    const payments: PaymentRow[] | null = paymentsResult.error
      ? null
      : ((paymentsResult.data ?? []) as unknown as PaymentRow[]);
    const taxes: TaxRow[] | null = taxResult.error
      ? null
      : ((taxResult.data ?? []) as unknown as TaxRow[]);

    const completed = payments?.filter((row) => row.status === "completed") ?? null;
    const refunded = payments?.filter((row) => row.status === "refunded") ?? null;
    const failed = payments?.filter((row) => row.status === "failed") ?? null;

    const grossRevenue = completed ? completed.reduce((sum, row) => sum + num(row.amount), 0) : null;
    const refundTotal = refunded ? refunded.reduce((sum, row) => sum + num(row.amount), 0) : null;
    const netRevenue = grossRevenue === null || refundTotal === null ? null : grossRevenue - refundTotal;

    const salesTaxes = taxes?.filter((row) => row.tax_type === "SALES_CONSUMPTION") ?? null;
    const salesTaxCollected = salesTaxes
      ? salesTaxes.reduce((sum, row) => sum + num(row.tax_collected), 0)
      : null;
    const salesTaxRemitted = salesTaxes
      ? salesTaxes.reduce((sum, row) => sum + num(row.tax_remitted), 0)
      : null;
    const salesTaxDue = salesTaxes
      ? salesTaxes.reduce((sum, row) => sum + num(row.amount_due), 0)
      : null;
    const totalBusinessTaxDue = taxes
      ? taxes.reduce((sum, row) => sum + num(row.amount_due), 0)
      : null;
    const taxJurisdictionsDue = taxes
      ? new Set(
          taxes
            .filter((row) => num(row.amount_due) > 0)
            .map((row) => `${row.country_code}:${row.jurisdiction_code ?? ""}`),
        ).size
      : null;

    return {
      asOf,
      grossRevenue: payments ? live(grossRevenue, "payment_transactions") : unavailable("payment_transactions"),
      netRevenue: payments ? live(netRevenue, "payment_transactions") : unavailable("payment_transactions"),
      activeMembers: membersResult.error
        ? unavailable("members")
        : live(membersResult.count ?? 0, "members"),
      newMembers30d: newMembersResult.error
        ? unavailable("members")
        : live(newMembersResult.count ?? 0, "members"),
      failedPayments: failed ? live(failed.length, "payment_transactions") : unavailable("payment_transactions"),
      refunds: refunded ? live(refundTotal, "payment_transactions") : unavailable("payment_transactions"),
      salesTaxCollected: salesTaxes
        ? live(salesTaxCollected, "business_tax_ledger")
        : unavailable("business_tax_ledger"),
      salesTaxRemitted: salesTaxes
        ? live(salesTaxRemitted, "business_tax_ledger")
        : unavailable("business_tax_ledger"),
      salesTaxDue: salesTaxes ? live(salesTaxDue, "business_tax_ledger") : unavailable("business_tax_ledger"),
      totalBusinessTaxDue: taxes
        ? live(totalBusinessTaxDue, "business_tax_ledger")
        : unavailable("business_tax_ledger"),
      taxJurisdictionsDue: taxes
        ? live(taxJurisdictionsDue, "business_tax_ledger")
        : unavailable("business_tax_ledger"),
      upload: {
        status: signedUploadConfigured && githubPublishingConfigured ? "READY" : "BLOCKED",
        signedUploadConfigured,
        fallbackAvailable,
        githubPublishingConfigured,
        problems,
      },
    };
  } catch {
    return {
      asOf,
      grossRevenue: unavailable("payment_transactions"),
      netRevenue: unavailable("payment_transactions"),
      activeMembers: unavailable("members"),
      newMembers30d: unavailable("members"),
      failedPayments: unavailable("payment_transactions"),
      refunds: unavailable("payment_transactions"),
      salesTaxCollected: unavailable("business_tax_ledger"),
      salesTaxRemitted: unavailable("business_tax_ledger"),
      salesTaxDue: unavailable("business_tax_ledger"),
      totalBusinessTaxDue: unavailable("business_tax_ledger"),
      taxJurisdictionsDue: unavailable("business_tax_ledger"),
      upload: {
        status: "BLOCKED",
        signedUploadConfigured,
        fallbackAvailable,
        githubPublishingConfigured,
        problems: [...problems, "Executive data source unavailable."],
      },
    };
  }
}
