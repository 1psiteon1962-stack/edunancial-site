"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { formatCountryPrice, getDisplayCountryPrices, type CountryPricedPlanId } from "@/lib/international/country-price-table";
import { getPricingCountryName, getPricingPageCopy } from "@/lib/international/pricing-page-copy";
import { getMembershipPlanCopy, resolveMembershipCopyLanguage } from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

export default function PricingPageClient() {
  const { effectiveLanguage, preferences, t } = useInternationalPreferences();
  const language = resolveMembershipCopyLanguage(effectiveLanguage);
  const pageCopy = getPricingPageCopy(effectiveLanguage);
  const localPrices = getDisplayCountryPrices(preferences.country);
  const usd = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("pricingPage.label")}</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">{t("pricingPage.title")}</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">{t("pricingPage.intro")}</p>
        <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {t("branding.publicDisclaimer")}
        </p>

        <div className="mt-10 max-w-4xl rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
          <p className="text-lg font-black text-white">{pageCopy.globalTitle}</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">{pageCopy.globalBody}</p>
          <p className="mt-3 text-sm font-bold text-blue-200">{pageCopy.globalTagline}</p>
        </div>

        {localPrices && (
          <div className="mt-6 max-w-4xl rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-sm leading-7 text-slate-100">
            <p className="font-bold">{pageCopy.localPricesNote(getPricingCountryName(localPrices.countryCode, effectiveLanguage))}</p>
            {!localPrices.checkoutEnabled && <p className="mt-1 text-slate-300">{pageCopy.purchaseNotOpen}</p>}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{t("pricingPage.freePlan.name")}</p>
            <p className="mt-4 text-4xl font-black">{t("pricingPage.freePlan.priceDisplay")}</p>
            <p className="mt-2 text-sm text-slate-400">{t("pricingPage.freePlan.billingLabel")}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{t("pricingPage.freePlan.description")}</p>
            <Link href="/register" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              {t("pricingPage.freePlan.ctaLabel")}
            </Link>
          </div>

          {publicMembershipPlans.map((plan) => {
            const copy = getMembershipPlanCopy(plan.id, language);
            const local = localPrices?.plans[plan.id as CountryPricedPlanId] ?? null;
            const money = (amount: number) => (local && localPrices ? formatCountryPrice(amount, localPrices) : usd(amount));
            const monthlyPrice = local ? local.monthly : plan.monthlyPrice;
            const annualPrice = local ? local.annual : plan.annualPrice;
            const annualSavings = monthlyPrice * 12 - annualPrice;
            const checkoutOpen = !local || Boolean(localPrices?.checkoutEnabled);
            const accessLabel = plan.id === "basic" ? pageCopy.levels12 : plan.id === "premium" ? pageCopy.levels14 : plan.id === "enterprise" ? pageCopy.levels15 : null;
            const valueLabel = plan.id === "premium" ? pageCopy.mostPopular : plan.id === "enterprise" ? pageCopy.completeAccess : null;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 ${plan.featured ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-slate-900/80"}`}
              >
                <div className="flex items-start justify-between gap-3">                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{copy.name}</p>                  {valueLabel && <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${plan.id === "premium" ? "bg-yellow-400 text-slate-950" : "bg-blue-500/20 text-blue-200"}`}>{valueLabel}</span>}                </div>                {accessLabel && <p className="mt-3 text-sm font-bold text-white">{accessLabel} • {pageCopy.allTracks}</p>}
                <p className="mt-4 text-4xl font-black">{money(monthlyPrice)}</p>
                <p className="mt-2 text-sm text-slate-400">{copy.billingLabel}</p>
                {annualPrice > 0 && (
                  <div className="mt-4 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
                    <p className="font-bold">{money(annualPrice)} {pageCopy.perYear}</p>
                    <p className="mt-1 text-xs text-slate-300">{pageCopy.save(money(annualSavings))}</p>                    {plan.id === "enterprise" && <p className="mt-2 text-xs font-bold uppercase tracking-wider text-yellow-300">{pageCopy.bestAnnualValue}</p>}
                  </div>
                )}
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {plan.id === "basic"
                    ? pageCopy.basicDescription
                    : plan.id === "premium"
                      ? pageCopy.premiumDescription
                      : plan.id === "enterprise"
                        ? pageCopy.enterpriseDescription
                        : copy.description}
                </p>
                <p className="mt-4 text-xs font-semibold text-slate-300">{pageCopy.cancelAnytime}</p>                {copy.legalNote && <p className="mt-4 text-xs leading-6 text-slate-400">{copy.legalNote}</p>}
                {!checkoutOpen ? (
                  <Link href="/contact" className="mt-6 inline-flex rounded-xl border border-yellow-400 px-5 py-3 font-bold text-yellow-200 transition hover:bg-yellow-400/10">
                    {pageCopy.purchaseNotOpen}
                  </Link>
                ) : plan.showContactOnly ? (
                  <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                    {copy.ctaLabel}
                  </Link>
                ) : (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/membership/checkout?plan=${plan.id}&billing=monthly`} className="inline-flex rounded-xl border border-blue-400 px-5 py-3 font-bold text-blue-200 transition hover:bg-blue-500/10">
                      {pageCopy.monthly}
                    </Link>
                    <Link href={`/membership/checkout?plan=${plan.id}&billing=annual`} className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                      {pageCopy.annual}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
