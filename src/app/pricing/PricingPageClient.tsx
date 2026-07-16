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

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 ${plan.featured ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-slate-900/80"}`}
              >
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{copy.name}</p>
                <p className="mt-4 text-4xl font-black">${plan.monthlyPrice.toFixed(2)}</p>
                <p className="mt-2 text-sm text-slate-400">{copy.billingLabel}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{copy.description}</p>
                {copy.legalNote && <p className="mt-4 text-xs leading-6 text-slate-400">{copy.legalNote}</p>}
                <Link href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`} className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                  {copy.ctaLabel}
                </Link>
              </div>
            );
          })}

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{t("pricingPage.enterprisePlan.name")}</p>
            <p className="mt-4 text-4xl font-black">{t("pricingPage.enterprisePlan.priceDisplay")}</p>
            <p className="mt-2 text-sm text-slate-400">{t("pricingPage.enterprisePlan.billingLabel")}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{t("pricingPage.enterprisePlan.description")}</p>
            <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              {t("pricingPage.enterprisePlan.ctaLabel")}
            </Link>
          </div>
        </div>
        <p className="mt-8 text-sm text-slate-400">{t("pricingPage.betaNote")}</p>
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
