"use client";

import Link from "next/link";

import PricingTable from "@/components/membership/PricingTable";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getMembershipPlanCopy, resolveMembershipCopyLanguage } from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

export default function PricingPageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const language = resolveMembershipCopyLanguage(effectiveLanguage);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("pricingPage.label")}</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">{t("pricingPage.title")}</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">{t("pricingPage.intro")}</p>
        <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {t("branding.publicDisclaimer")}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            const annualSavings = plan.monthlyPrice * 12 - plan.annualPrice;
            const accessLabel = plan.id === "basic" ? "Levels 1–2" : plan.id === "premium" ? "Levels 1–4" : plan.id === "enterprise" ? "Levels 1–5" : null;
            const valueLabel = plan.id === "premium" ? "Most Popular" : plan.id === "enterprise" ? "Complete Access" : null;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 ${plan.featured ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-slate-900/80"}`}
              >
                <div className="flex items-start justify-between gap-3">                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{copy.name}</p>                  {valueLabel && <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${plan.id === "premium" ? "bg-yellow-400 text-slate-950" : "bg-blue-500/20 text-blue-200"}`}>{valueLabel}</span>}                </div>                {accessLabel && <p className="mt-3 text-sm font-bold text-white">{accessLabel} • All 8 learning tracks</p>}
                <p className="mt-4 text-4xl font-black">${plan.monthlyPrice.toFixed(2)}</p>
                <p className="mt-2 text-sm text-slate-400">{copy.billingLabel}</p>
                {plan.annualPrice > 0 && (
                  <div className="mt-4 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
                    <p className="font-bold">${plan.annualPrice.toFixed(2)} / year</p>
                    <p className="mt-1 text-xs text-slate-300">Save ${annualSavings.toFixed(2)} versus 12 monthly payments</p>                    {plan.id === "enterprise" && <p className="mt-2 text-xs font-bold uppercase tracking-wider text-yellow-300">Best annual value</p>}
                  </div>
                )}
                <p className="mt-4 text-sm leading-7 text-slate-300">{copy.description}</p>
                <p className="mt-4 text-xs font-semibold text-slate-300">Cancel anytime.</p>                {copy.legalNote && <p className="mt-4 text-xs leading-6 text-slate-400">{copy.legalNote}</p>}
                {plan.showContactOnly ? (
                  <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                    {copy.ctaLabel}
                  </Link>
                ) : (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/membership/checkout?plan=${plan.id}&billing=monthly`} className="inline-flex rounded-xl border border-blue-400 px-5 py-3 font-bold text-blue-200 transition hover:bg-blue-500/10">
                      Monthly
                    </Link>
                    <Link href={`/membership/checkout?plan=${plan.id}&billing=annual`} className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                      Annual
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PricingTable />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300">
            {t("pricingPage.primaryLabel")}
          </Link>
          <Link href="/contact" className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950">
            {t("pricingPage.secondaryLabel")}
          </Link>
        </div>
      </section>
    </main>
  );
}
