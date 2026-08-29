import { COUNTRY_PRICING_POLICIES } from "@/lib/location/pricing";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { paymentCatalog } from "@/lib/payments/catalog";
import { hasPaymentPersistenceConfig } from "@/lib/payments/persistence";
import { canonicalCountries, getCountryRuntimeControls } from "@/lib/regions/runtime-controls";
import { hasSquareWebhookVerificationConfig, isSquareVerifiedCheckoutEnabled } from "@/lib/square";

export type LiveValue = { value: number | null; status: "LIVE" | "UNAVAILABLE"; source: string };
export type SystemHealthStatus = "READY" | "DEGRADED" | "BLOCKED";

export interface ExecutiveOperationsSnapshot {
  asOf: string;
  grossRevenue: LiveValue;
  netRevenue: LiveValue;
  activeMembers: LiveValue;
  newMembers30d: LiveValue;
  basicMembers: LiveValue;
  proMembers: LiveValue;
  goldMembers: LiveValue;
  activeSubscriptions: LiveValue;
  mrr: LiveValue;
  arr: LiveValue;
  failedPayments: LiveValue;
  refunds: LiveValue;
  salesTaxCollected: LiveValue;
  salesTaxRemitted: LiveValue;
  salesTaxDue: LiveValue;
  totalBusinessTaxDue: LiveValue;
  taxJurisdictionsDue: LiveValue;
  payment: {
    status: SystemHealthStatus;
    squareConfigured: boolean;
    persistenceConfigured: boolean;
    webhookVerificationConfigured: boolean;
    problems: string[];
  };
  globalCommerce: {
    status: SystemHealthStatus;
    canonicalCountries: number;
    enabledCountries: number | null;
    pricedCountries: number;
    enabledWithoutPricing: string[];
    runtimeControlsAvailable: boolean;
    problems: string[];
  };
  video: {
    projects: LiveValue;
    mastersReady: LiveValue;
    queuedJobs: LiveValue;
    processingJobs: LiveValue;
    successfulRenders: LiveValue;
    failedRenders: LiveValue;
    renders30d: LiveValue;
    successRate: LiveValue;
    status: SystemHealthStatus;
    workerConfigured: boolean;
    ttsConfigured: boolean;
    problems: string[];
  };
  upload: {
    status: SystemHealthStatus;
    signedUploadConfigured: boolean;
    fallbackAvailable: boolean;
    githubPublishingConfigured: boolean;
    failures24h: number | null;
    fallbacks24h: number | null;
    lastFailure: string | null;
    problems: string[];
  };
}

type PaymentRow = { amount: number | string | null; status: string | null };
type MemberRow = { membership_tier: string | null; active: boolean | null };
type SubRow = { plan_id: string; status: string | null };
type TaxRow = { country_code: string; jurisdiction_code: string | null; tax_type: string; tax_collected: number | string | null; tax_remitted: number | string | null; amount_due: number | string | null };
type UploadOp = { status: string; error_message: string | null };
type VideoProject = { status: string | null };
type VideoJob = { status: string | null; completed_at: string | null };

const live = (value: number | null, source: string): LiveValue => ({ value, status: value === null ? "UNAVAILABLE" : "LIVE", source });
const num = (value: unknown) => { const parsed = Number(value ?? 0); return Number.isFinite(parsed) ? parsed : 0; };
const no = (source: string) => live(null, source);
const monthlyPlanPrice = (id: string) => paymentCatalog.find((item) => item.active && item.isRecurring && item.recurringInterval === "monthly" && item.membershipPlanId === id)?.price ?? null;

function buildStaticHealth() {
  const squareConfigured = isSquareVerifiedCheckoutEnabled();
  const persistenceConfigured = hasPaymentPersistenceConfig();
  const webhookVerificationConfigured = hasSquareWebhookVerificationConfig();
  const paymentProblems: string[] = [];
  if (!squareConfigured) paymentProblems.push("Square application, location, or access token configuration is incomplete.");
  if (!persistenceConfigured) paymentProblems.push("Payment persistence is not configured.");
  if (!webhookVerificationConfigured) paymentProblems.push("Square webhook verification is not configured.");
  const paymentStatus: SystemHealthStatus = paymentProblems.length ? "BLOCKED" : "READY";

  const workerUrl = process.env.WORKER_BASE_URL?.trim() ?? "";
  const workerSecret = process.env.WORKER_SHARED_SECRET?.trim() ?? "";
  const workerConfigured = Boolean(workerUrl) && workerSecret.length >= 32 && (process.env.NODE_ENV !== "production" || /^https:\/\//iu.test(workerUrl));
  const ttsConfigured = Boolean(process.env.OPENAI_API_KEY?.trim());

  const signedUploadConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() && (process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET?.trim() || process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY?.trim()));
  const githubPublishingConfigured = Boolean(process.env.EDUNANCIAL_GITHUB_TOKEN?.trim() && process.env.EDUNANCIAL_GITHUB_OWNER?.trim() && process.env.EDUNANCIAL_GITHUB_REPO?.trim());
  const fallbackAvailable = process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const uploadProblems: string[] = [];
  if (!signedUploadConfigured) uploadProblems.push("Signed upload configuration incomplete.");
  if (!githubPublishingConfigured) uploadProblems.push("GitHub publishing configuration incomplete.");

  return {
    payment: { status: paymentStatus, squareConfigured, persistenceConfigured, webhookVerificationConfigured, problems: paymentProblems },
    video: { workerConfigured, ttsConfigured },
    upload: { signedUploadConfigured, githubPublishingConfigured, fallbackAvailable, problems: uploadProblems },
  };
}

export async function getExecutiveOperationsSnapshot(): Promise<ExecutiveOperationsSnapshot> {
  const asOf = new Date().toISOString();
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const since24 = new Date(Date.now() - 86400000).toISOString();
  const staticHealth = buildStaticHealth();
  const canonical = canonicalCountries();
  const pricedCountries = Object.keys(COUNTRY_PRICING_POLICIES).length;

  let runtimeControls: Awaited<ReturnType<typeof getCountryRuntimeControls>> | null = null;
  try { runtimeControls = await getCountryRuntimeControls(); } catch { runtimeControls = null; }
  const enabled = runtimeControls?.filter((country) => ["ACTIVE", "BETA"].includes(country.launchState)) ?? null;
  const enabledWithoutPricing = enabled?.filter((country) => !COUNTRY_PRICING_POLICIES[country.countryCode]).map((country) => country.countryCode) ?? [];
  const globalProblems: string[] = [];
  if (!runtimeControls) globalProblems.push("Country runtime controls are unavailable.");
  if (enabledWithoutPricing.length) globalProblems.push(`${enabledWithoutPricing.length} enabled country/countries have no approved pricing policy.`);
  const globalStatus: SystemHealthStatus = !runtimeControls ? "BLOCKED" : enabledWithoutPricing.length ? "DEGRADED" : "READY";

  try {
    const db = getKpiSupabaseAdmin();
    const [pr, mr, nr, sr, tr, ur, vpr, vjr] = await Promise.all([
      db.from("payment_transactions").select("amount,status"),
      db.from("members").select("membership_tier,active"),
      db.from("members").select("id", { count: "exact", head: true }).gte("created_at", since30),
      db.from("subscriptions").select("plan_id,status"),
      db.from("business_tax_ledger").select("country_code,jurisdiction_code,tax_type,tax_collected,tax_remitted,amount_due"),
      db.from("admin_upload_operations").select("status,error_message").gte("created_at", since24).order("created_at", { ascending: false }).limit(500),
      db.from("video_projects").select("status"),
      db.from("video_jobs").select("status,completed_at"),
    ]);

    const payments = pr.error ? null : (pr.data ?? []) as PaymentRow[];
    const members = mr.error ? null : (mr.data ?? []) as MemberRow[];
    const subs = sr.error ? null : (sr.data ?? []) as SubRow[];
    const taxes = tr.error ? null : (tr.data ?? []) as TaxRow[];
    const ops = ur.error ? null : (ur.data ?? []) as UploadOp[];
    const projects = vpr.error ? null : (vpr.data ?? []) as VideoProject[];
    const jobs = vjr.error ? null : (vjr.data ?? []) as VideoJob[];

    const completed = payments?.filter((row) => row.status === "completed") ?? null;
    const refunded = payments?.filter((row) => row.status === "refunded") ?? null;
    const failed = payments?.filter((row) => row.status === "failed") ?? null;
    const gross = completed ? completed.reduce((sum, row) => sum + num(row.amount), 0) : null;
    const refundTotal = refunded ? refunded.reduce((sum, row) => sum + num(row.amount), 0) : null;
    const net = gross === null || refundTotal === null ? null : gross - refundTotal;

    const active = members?.filter((row) => row.active) ?? null;
    const tier = (name: string) => active ? active.filter((row) => (row.membership_tier ?? "").toLowerCase().includes(name)).length : null;
    const activeSubs = subs?.filter((row) => row.status === "active") ?? null;
    const prices = activeSubs?.map((row) => monthlyPlanPrice(row.plan_id)) ?? null;
    const mrr = prices && prices.every((price) => price !== null) ? prices.reduce((sum, price) => sum + (price ?? 0), 0) : null;

    const sales = taxes?.filter((row) => row.tax_type === "SALES_CONSUMPTION") ?? null;
    const collected = sales ? sales.reduce((sum, row) => sum + num(row.tax_collected), 0) : null;
    const remitted = sales ? sales.reduce((sum, row) => sum + num(row.tax_remitted), 0) : null;
    const salesDue = sales ? sales.reduce((sum, row) => sum + num(row.amount_due), 0) : null;
    const totalDue = taxes ? taxes.reduce((sum, row) => sum + num(row.amount_due), 0) : null;
    const jurisdictions = taxes ? new Set(taxes.filter((row) => num(row.amount_due) > 0).map((row) => `${row.country_code}:${row.jurisdiction_code ?? ""}`)).size : null;

    const failures = ops?.filter((row) => row.status === "FAILED") ?? null;
    const fallbacks = ops?.filter((row) => row.status === "FALLBACK") ?? null;
    const lastFailure = failures?.[0]?.error_message ?? null;
    const uploadProblems = [...staticHealth.upload.problems];
    if (failures?.length) uploadProblems.push(`${failures.length} upload pipeline failure(s) recorded in the last 24 hours.`);
    const uploadStatus: SystemHealthStatus = !staticHealth.upload.signedUploadConfigured ? "BLOCKED" : failures?.length ? "DEGRADED" : "READY";

    const succeeded = jobs?.filter((row) => row.status === "succeeded") ?? null;
    const videoFailed = jobs?.filter((row) => row.status === "failed") ?? null;
    const queued = jobs?.filter((row) => row.status === "queued") ?? null;
    const processing = jobs?.filter((row) => row.status === "processing") ?? null;
    const terminal = succeeded && videoFailed ? succeeded.length + videoFailed.length : null;
    const successRate = terminal === null ? null : terminal === 0 ? 0 : (succeeded!.length / terminal) * 100;
    const renders30d = jobs ? jobs.filter((row) => row.completed_at && row.completed_at >= since30).length : null;
    const videoProblems: string[] = [];
    if (!staticHealth.video.workerConfigured) videoProblems.push("Video worker configuration is incomplete or unsafe.");
    if (!staticHealth.video.ttsConfigured) videoProblems.push("Multilingual TTS is not configured.");
    if (videoFailed?.length) videoProblems.push(`${videoFailed.length} render job(s) are currently recorded as failed.`);
    const videoStatus: SystemHealthStatus = !staticHealth.video.workerConfigured || !staticHealth.video.ttsConfigured ? "BLOCKED" : videoFailed?.length ? "DEGRADED" : "READY";

    return {
      asOf,
      grossRevenue: payments ? live(gross, "payment_transactions") : no("payment_transactions"),
      netRevenue: payments ? live(net, "payment_transactions") : no("payment_transactions"),
      activeMembers: active ? live(active.length, "members") : no("members"),
      newMembers30d: nr.error ? no("members") : live(nr.count ?? 0, "members"),
      basicMembers: active ? live(tier("basic"), "members") : no("members"),
      proMembers: active ? live((tier("premium") ?? 0) + (tier("pro") ?? 0), "members") : no("members"),
      goldMembers: active ? live((tier("enterprise") ?? 0) + (tier("gold") ?? 0), "members") : no("members"),
      activeSubscriptions: activeSubs ? live(activeSubs.length, "subscriptions") : no("subscriptions"),
      mrr: mrr !== null ? live(mrr, "subscriptions + paymentCatalog") : no("subscriptions + paymentCatalog"),
      arr: mrr !== null ? live(mrr * 12, "subscriptions + paymentCatalog") : no("subscriptions + paymentCatalog"),
      failedPayments: failed ? live(failed.length, "payment_transactions") : no("payment_transactions"),
      refunds: refunded ? live(refundTotal, "payment_transactions") : no("payment_transactions"),
      salesTaxCollected: sales ? live(collected, "business_tax_ledger") : no("business_tax_ledger"),
      salesTaxRemitted: sales ? live(remitted, "business_tax_ledger") : no("business_tax_ledger"),
      salesTaxDue: sales ? live(salesDue, "business_tax_ledger") : no("business_tax_ledger"),
      totalBusinessTaxDue: taxes ? live(totalDue, "business_tax_ledger") : no("business_tax_ledger"),
      taxJurisdictionsDue: taxes ? live(jurisdictions, "business_tax_ledger") : no("business_tax_ledger"),
      payment: staticHealth.payment,
      globalCommerce: { status: globalStatus, canonicalCountries: canonical.length, enabledCountries: enabled?.length ?? null, pricedCountries, enabledWithoutPricing, runtimeControlsAvailable: Boolean(runtimeControls), problems: globalProblems },
      video: {
        projects: projects ? live(projects.length, "video_projects") : no("video_projects"),
        mastersReady: projects ? live(projects.filter((row) => row.status === "master_ready").length, "video_projects") : no("video_projects"),
        queuedJobs: jobs ? live(queued?.length ?? 0, "video_jobs") : no("video_jobs"),
        processingJobs: jobs ? live(processing?.length ?? 0, "video_jobs") : no("video_jobs"),
        successfulRenders: succeeded ? live(succeeded.length, "video_jobs") : no("video_jobs"),
        failedRenders: videoFailed ? live(videoFailed.length, "video_jobs") : no("video_jobs"),
        renders30d: jobs ? live(renders30d, "video_jobs") : no("video_jobs"),
        successRate: jobs ? live(successRate, "video_jobs") : no("video_jobs"),
        status: videoStatus,
        workerConfigured: staticHealth.video.workerConfigured,
        ttsConfigured: staticHealth.video.ttsConfigured,
        problems: videoProblems,
      },
      upload: { status: uploadStatus, signedUploadConfigured: staticHealth.upload.signedUploadConfigured, fallbackAvailable: staticHealth.upload.fallbackAvailable, githubPublishingConfigured: staticHealth.upload.githubPublishingConfigured, failures24h: failures?.length ?? null, fallbacks24h: fallbacks?.length ?? null, lastFailure, problems: uploadProblems },
    };
  } catch {
    const videoProblems = ["Executive data source unavailable."];
    if (!staticHealth.video.workerConfigured) videoProblems.push("Video worker configuration is incomplete or unsafe.");
    if (!staticHealth.video.ttsConfigured) videoProblems.push("Multilingual TTS is not configured.");
    return {
      asOf,
      grossRevenue: no("payment_transactions"), netRevenue: no("payment_transactions"), activeMembers: no("members"), newMembers30d: no("members"), basicMembers: no("members"), proMembers: no("members"), goldMembers: no("members"), activeSubscriptions: no("subscriptions"), mrr: no("subscriptions + paymentCatalog"), arr: no("subscriptions + paymentCatalog"), failedPayments: no("payment_transactions"), refunds: no("payment_transactions"), salesTaxCollected: no("business_tax_ledger"), salesTaxRemitted: no("business_tax_ledger"), salesTaxDue: no("business_tax_ledger"), totalBusinessTaxDue: no("business_tax_ledger"), taxJurisdictionsDue: no("business_tax_ledger"),
      payment: staticHealth.payment,
      globalCommerce: { status: globalStatus, canonicalCountries: canonical.length, enabledCountries: enabled?.length ?? null, pricedCountries, enabledWithoutPricing, runtimeControlsAvailable: Boolean(runtimeControls), problems: globalProblems },
      video: { projects: no("video_projects"), mastersReady: no("video_projects"), queuedJobs: no("video_jobs"), processingJobs: no("video_jobs"), successfulRenders: no("video_jobs"), failedRenders: no("video_jobs"), renders30d: no("video_jobs"), successRate: no("video_jobs"), status: "BLOCKED", workerConfigured: staticHealth.video.workerConfigured, ttsConfigured: staticHealth.video.ttsConfigured, problems: videoProblems },
      upload: { status: "BLOCKED", signedUploadConfigured: staticHealth.upload.signedUploadConfigured, fallbackAvailable: staticHealth.upload.fallbackAvailable, githubPublishingConfigured: staticHealth.upload.githubPublishingConfigured, failures24h: null, fallbacks24h: null, lastFailure: null, problems: [...staticHealth.upload.problems, "Executive data source unavailable."] },
    };
  }
}
