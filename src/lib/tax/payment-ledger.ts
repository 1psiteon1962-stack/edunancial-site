import { createClient } from "@supabase/supabase-js";

export interface PaymentTaxLedgerEntry {
  sourceReference: string;
  countryCode: string;
  jurisdictionCode?: string | null;
  currency: string;
  taxCollectedMinor: number;
  transactionAt?: string;
  ruleVersion?: string | null;
  registrationAccountRef?: string | null;
  notes?: string | null;
}

function getTaxLedgerDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Tax ledger persistence requires Supabase server configuration.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function toDateOnly(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid tax-ledger transaction timestamp.");
  return date.toISOString().slice(0, 10);
}

export async function recordPaymentTaxLedgerEntry(entry: PaymentTaxLedgerEntry): Promise<void> {
  if (!entry.sourceReference.trim()) throw new Error("Tax ledger sourceReference is required.");
  if (!Number.isSafeInteger(entry.taxCollectedMinor) || entry.taxCollectedMinor < 0) {
    throw new Error("Tax ledger taxCollectedMinor must be a non-negative integer.");
  }

  const transactionAt = entry.transactionAt ?? new Date().toISOString();
  const period = toDateOnly(transactionAt);
  const db = getTaxLedgerDb();
  const { error } = await db.from("business_tax_ledger").upsert({
    tax_type: "SALES_CONSUMPTION",
    country_code: entry.countryCode.trim().toUpperCase(),
    jurisdiction_code: entry.jurisdictionCode?.trim().toUpperCase() || null,
    period_start: period,
    period_end: period,
    currency: entry.currency.trim().toUpperCase(),
    tax_collected: entry.taxCollectedMinor / 100,
    tax_accrued: 0,
    tax_remitted: 0,
    adjustments: 0,
    registration_account_ref: entry.registrationAccountRef?.trim() || null,
    rule_version: entry.ruleVersion?.trim() || null,
    source_system: "square",
    source_reference: entry.sourceReference.trim(),
    notes: entry.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "source_system,source_reference,tax_type" });

  if (error) throw new Error(`Unable to persist payment tax ledger entry: ${error.message}`);
}
