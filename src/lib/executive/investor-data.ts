import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type DemographicRollup = {
  country: string;
  region: string;
  gender: string;
  ageBand: string;
  users: number;
};

export type CurrencyRollup = {
  currency: string;
  completedTransactions: number;
  revenueOriginalCurrency: number;
  revenueUsd: number;
  missingFxTransactions: number;
};

export type LevelAdvancementRollup = {
  trackCode: string;
  toLevel: string;
  advancements: number;
};

export type GrowthForecast = {
  horizonDays: number;
  dimensionType: string;
  dimensionValue: string;
  combinedGrowthScore: number;
  outlook: string;
  confidence: number;
  internalObservations: number;
  externalObservations: number;
  generatedAt: string;
};

export type TaxLocationRollup = {
  countryCode: string;
  subdivisionCode: string | null;
  locality: string | null;
  taxName: string;
  currency: string;
  taxableTransactions: number;
  taxableSales: number;
  taxCollected: number;
};

export type TaxLiability = {
  taxType: string;
  countryCode: string;
  jurisdictionCode: string | null;
  periodStart: string;
  periodEnd: string;
  currency: string;
  taxCollected: number;
  taxAccrued: number;
  taxRemitted: number;
  amountDue: number;
  filingDueAt: string | null;
};

export type InvestorDataSnapshot = {
  demographics: DemographicRollup[];
  revenueByCurrency: CurrencyRollup[];
  levelAdvancements: LevelAdvancementRollup[];
  growthForecasts: GrowthForecast[];
  taxByLocation: TaxLocationRollup[];
  taxLiabilities: TaxLiability[];
  generatedAt: string;
};

const n = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function getInvestorDataSnapshot(): Promise<InvestorDataSnapshot> {
  const db = getSupabaseAdminClient();

  const [demographicsResult, currencyResult, advancementResult, forecastResult, taxLocationResult, taxLiabilityResult] = await Promise.all([
    db.from("investor_demographic_rollup").select("country,region,gender,age_band,users").order("users", { ascending: false }).limit(500),
    db.from("investor_revenue_by_currency").select("currency,completed_transactions,revenue_original_currency,revenue_usd,missing_fx_transactions").order("revenue_usd", { ascending: false }),
    db.from("learning_level_advancements").select("track_code,to_level"),
    db.from("growth_forecast_snapshots").select("horizon_days,dimension_type,dimension_value,combined_growth_score,outlook,confidence,internal_observations,external_observations,generated_at").order("generated_at", { ascending: false }).limit(100),
    db.from("sales_tax_collected_by_location").select("country_code,subdivision_code,locality,tax_name,currency,taxable_transactions,taxable_sales,tax_collected").order("tax_collected", { ascending: false }).limit(500),
    db.from("business_tax_ledger").select("tax_type,country_code,jurisdiction_code,period_start,period_end,currency,tax_collected,tax_accrued,tax_remitted,amount_due,filing_due_at").order("filing_due_at", { ascending: true }).limit(500),
  ]);

  const demographicRows = demographicsResult.error ? [] : demographicsResult.data ?? [];
  const currencyRows = currencyResult.error ? [] : currencyResult.data ?? [];
  const advancementRows = advancementResult.error ? [] : advancementResult.data ?? [];
  const forecastRows = forecastResult.error ? [] : forecastResult.data ?? [];
  const taxLocationRows = taxLocationResult.error ? [] : taxLocationResult.data ?? [];
  const taxLiabilityRows = taxLiabilityResult.error ? [] : taxLiabilityResult.data ?? [];

  const advancementMap = new Map<string, LevelAdvancementRollup>();
  for (const row of advancementRows) {
    const trackCode = String(row.track_code ?? "Unknown");
    const toLevel = String(row.to_level ?? "Unknown");
    const key = `${trackCode}|${toLevel}`;
    const current = advancementMap.get(key) ?? { trackCode, toLevel, advancements: 0 };
    current.advancements += 1;
    advancementMap.set(key, current);
  }

  return {
    demographics: demographicRows.map((row) => ({
      country: String(row.country ?? "Unknown"),
      region: String(row.region ?? "Unknown"),
      gender: String(row.gender ?? "not_reported"),
      ageBand: String(row.age_band ?? "Unknown"),
      users: n(row.users),
    })),
    revenueByCurrency: currencyRows.map((row) => ({
      currency: String(row.currency ?? "Unknown"),
      completedTransactions: n(row.completed_transactions),
      revenueOriginalCurrency: n(row.revenue_original_currency),
      revenueUsd: n(row.revenue_usd),
      missingFxTransactions: n(row.missing_fx_transactions),
    })),
    levelAdvancements: [...advancementMap.values()].sort((a, b) => b.advancements - a.advancements),
    growthForecasts: forecastRows.map((row) => ({
      horizonDays: n(row.horizon_days),
      dimensionType: String(row.dimension_type ?? "unknown"),
      dimensionValue: String(row.dimension_value ?? "unknown"),
      combinedGrowthScore: n(row.combined_growth_score),
      outlook: String(row.outlook ?? "insufficient_data"),
      confidence: n(row.confidence),
      internalObservations: n(row.internal_observations),
      externalObservations: n(row.external_observations),
      generatedAt: String(row.generated_at ?? ""),
    })),
    taxByLocation: taxLocationRows.map((row) => ({
      countryCode: String(row.country_code ?? ""),
      subdivisionCode: row.subdivision_code ? String(row.subdivision_code) : null,
      locality: row.locality ? String(row.locality) : null,
      taxName: String(row.tax_name ?? "Tax"),
      currency: String(row.currency ?? ""),
      taxableTransactions: n(row.taxable_transactions),
      taxableSales: n(row.taxable_sales),
      taxCollected: n(row.tax_collected),
    })),
    taxLiabilities: taxLiabilityRows.map((row) => ({
      taxType: String(row.tax_type ?? "OTHER"),
      countryCode: String(row.country_code ?? ""),
      jurisdictionCode: row.jurisdiction_code ? String(row.jurisdiction_code) : null,
      periodStart: String(row.period_start ?? ""),
      periodEnd: String(row.period_end ?? ""),
      currency: String(row.currency ?? ""),
      taxCollected: n(row.tax_collected),
      taxAccrued: n(row.tax_accrued),
      taxRemitted: n(row.tax_remitted),
      amountDue: n(row.amount_due),
      filingDueAt: row.filing_due_at ? String(row.filing_due_at) : null,
    })),
    generatedAt: new Date().toISOString(),
  };
}
