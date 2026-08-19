import { createClient } from "@supabase/supabase-js";
import type { TaxComponent, TaxProductKind, TaxQuote, TaxQuoteRequest } from "./architecture";
import { createManualReviewQuote, createZeroTaxQuote, jurisdictionKey } from "./architecture";

interface RuntimeRuleRow {
  country_code: string;
  subdivision_code: string | null;
  postal_prefix: string | null;
  product_kind: string;
  currency: string;
  tax_type: string;
  rate_basis_points: number | null;
  taxable: boolean | null;
  effective_from: string;
  effective_to: string | null;
  source_authority: string;
  source_reference: string;
  date_verified: string;
  verification_status: "verified" | "stale" | "needs-review";
  rule_version: string;
  metadata: Record<string, unknown> | null;
}

interface RegistrationRow {
  country_code: string;
  subdivision_code: string | null;
  tax_type: string;
  registration_status: string;
  registration_account_ref: string | null;
}

interface NexusRow {
  country_code: string;
  subdivision_code: string | null;
  economic_nexus: boolean;
  physical_nexus: boolean;
  registration_required: boolean;
  period_end: string;
}

export interface RuntimeTaxDecision {
  quote: TaxQuote;
  registrationAccountRef: string | null;
  ruleVersion: string | null;
  sourceReferences: string[];
}

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Runtime tax calculation requires Supabase server configuration.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function dateOnly(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid transaction date for tax calculation.");
  return date.toISOString().slice(0, 10);
}

function normalize(value?: string): string | null {
  const normalized = value?.trim().toUpperCase();
  return normalized || null;
}

function matchesPostalPrefix(rule: RuntimeRuleRow, postalCode?: string): boolean {
  if (!rule.postal_prefix) return true;
  return (postalCode ?? "").trim().toUpperCase().startsWith(rule.postal_prefix.trim().toUpperCase());
}

function rateToTax(amountMinor: number, basisPoints: number): number {
  return Math.round(amountMinor * (basisPoints / 10_000));
}

function mostSpecificRules(rows: RuntimeRuleRow[], subdivisionCode?: string, postalCode?: string): RuntimeRuleRow[] {
  const subdivision = normalize(subdivisionCode);
  const eligible = rows.filter((row) => {
    const ruleSubdivision = normalize(row.subdivision_code ?? undefined);
    if (ruleSubdivision && ruleSubdivision !== subdivision) return false;
    return matchesPostalPrefix(row, postalCode);
  });

  if (!eligible.length) return [];
  const maxSpecificity = Math.max(...eligible.map((row) => (row.postal_prefix ? 2 : row.subdivision_code ? 1 : 0)));
  return eligible.filter((row) => (row.postal_prefix ? 2 : row.subdivision_code ? 1 : 0) === maxSpecificity);
}

function registrationAllowsCollection(registration: RegistrationRow | null, nexus: NexusRow | null): boolean {
  if (registration?.registration_status === "registered" || registration?.registration_status === "required") return true;
  return Boolean(nexus?.registration_required || nexus?.economic_nexus || nexus?.physical_nexus);
}

export async function calculateRuntimeTax(request: TaxQuoteRequest): Promise<RuntimeTaxDecision> {
  const db = getDb();
  const countryCode = request.customer.countryCode.trim().toUpperCase();
  const subdivisionCode = normalize(request.customer.subdivisionCode);
  const transactionDate = dateOnly(request.transactionAt);
  const productKind: TaxProductKind = request.productKind;
  const currency = request.subtotal.currency.trim().toUpperCase();

  const [rulesResult, registrationResult, nexusResult] = await Promise.all([
    db
      .from("tax_runtime_rules")
      .select("country_code,subdivision_code,postal_prefix,product_kind,currency,tax_type,rate_basis_points,taxable,effective_from,effective_to,source_authority,source_reference,date_verified,verification_status,rule_version,metadata")
      .eq("country_code", countryCode)
      .eq("product_kind", productKind)
      .eq("currency", currency)
      .lte("effective_from", transactionDate)
      .or(`effective_to.is.null,effective_to.gte.${transactionDate}`),
    db
      .from("tax_registrations")
      .select("country_code,subdivision_code,tax_type,registration_status,registration_account_ref")
      .eq("country_code", countryCode),
    db
      .from("tax_nexus_snapshots")
      .select("country_code,subdivision_code,economic_nexus,physical_nexus,registration_required,period_end")
      .eq("country_code", countryCode)
      .order("period_end", { ascending: false })
      .limit(50),
  ]);

  if (rulesResult.error) throw new Error(`Unable to resolve tax rules: ${rulesResult.error.message}`);
  if (registrationResult.error) throw new Error(`Unable to resolve tax registration: ${registrationResult.error.message}`);
  if (nexusResult.error) throw new Error(`Unable to resolve tax nexus: ${nexusResult.error.message}`);

  const rules = mostSpecificRules((rulesResult.data ?? []) as unknown as RuntimeRuleRow[], subdivisionCode ?? undefined, request.customer.postalCode);
  if (!rules.length) {
    return { quote: createManualReviewQuote(request, `No effective tax rule exists for ${jurisdictionKey(request.customer)} and ${productKind}.`), registrationAccountRef: null, ruleVersion: null, sourceReferences: [] };
  }
  if (rules.some((rule) => rule.verification_status !== "verified")) {
    return { quote: createManualReviewQuote(request, "One or more applicable tax rules are stale or require compliance review."), registrationAccountRef: null, ruleVersion: null, sourceReferences: rules.map((rule) => rule.source_reference) };
  }
  if (rules.some((rule) => rule.taxable === null || rule.rate_basis_points === null)) {
    return { quote: createManualReviewQuote(request, "Applicable tax rule is incomplete; automatic collection is disabled."), registrationAccountRef: null, ruleVersion: null, sourceReferences: rules.map((rule) => rule.source_reference) };
  }

  const registrations = (registrationResult.data ?? []) as unknown as RegistrationRow[];
  const registration = registrations.find((row) => normalize(row.subdivision_code ?? undefined) === subdivisionCode)
    ?? registrations.find((row) => !row.subdivision_code)
    ?? null;
  const nexusRows = (nexusResult.data ?? []) as unknown as NexusRow[];
  const nexus = nexusRows.find((row) => normalize(row.subdivision_code ?? undefined) === subdivisionCode)
    ?? nexusRows.find((row) => !row.subdivision_code)
    ?? null;

  const anyTaxable = rules.some((rule) => rule.taxable === true);
  if (!anyTaxable) {
    const ruleVersion = [...new Set(rules.map((rule) => rule.rule_version))].join("+");
    return {
      quote: { ...createZeroTaxQuote(request, "Verified runtime rules classify this product as non-taxable.", "not-taxable"), ruleVersionId: ruleVersion },
      registrationAccountRef: registration?.registration_account_ref ?? null,
      ruleVersion,
      sourceReferences: rules.map((rule) => rule.source_reference),
    };
  }

  if (!registrationAllowsCollection(registration, nexus)) {
    const ruleVersion = [...new Set(rules.map((rule) => rule.rule_version))].join("+");
    return {
      quote: { ...createZeroTaxQuote(request, "Verified rule is taxable, but current registration/nexus data does not require collection.", "not-required"), taxable: true, ruleVersionId: ruleVersion },
      registrationAccountRef: registration?.registration_account_ref ?? null,
      ruleVersion,
      sourceReferences: rules.map((rule) => rule.source_reference),
    };
  }

  const taxableRules = rules.filter((rule) => rule.taxable === true && rule.rate_basis_points !== null);
  const components: TaxComponent[] = taxableRules.map((rule) => ({
    kind: rule.tax_type,
    authority: rule.source_authority,
    rate: (rule.rate_basis_points ?? 0) / 100,
    amountMinor: rateToTax(request.subtotal.amountMinor, rule.rate_basis_points ?? 0),
  }));
  const taxMinor = components.reduce((sum, component) => sum + component.amountMinor, 0);
  const ruleVersion = [...new Set(taxableRules.map((rule) => rule.rule_version))].join("+");

  return {
    quote: {
      jurisdictionKey: jurisdictionKey(request.customer),
      taxable: true,
      collectionRequired: true,
      subtotal: request.subtotal,
      tax: { amountMinor: taxMinor, currency },
      total: { amountMinor: request.subtotal.amountMinor + taxMinor, currency },
      components,
      ruleVersionId: ruleVersion,
      reason: "Verified runtime tax rules and current registration/nexus state require collection.",
      status: "calculated",
    },
    registrationAccountRef: registration?.registration_account_ref ?? null,
    ruleVersion,
    sourceReferences: taxableRules.map((rule) => rule.source_reference),
  };
}
