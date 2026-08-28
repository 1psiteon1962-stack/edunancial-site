"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import PaymentLinkCheckoutButton from "@/components/payments/PaymentLinkCheckoutButton";
import { formatLocalizedPrice, getLocalizedCatalogPrice } from "@/lib/location/pricing";
import {
  getMembershipFeatureLabel,
  getMembershipPlanCopy,
  resolveMembershipCopyLanguage,
} from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

function getLocalPriceNote(language: string, countryCode: string) {
  if (language.startsWith("es")) return `Precio local para ${countryCode}. Los impuestos aplicables se calculan al finalizar la compra.`;
  if (language.startsWith("fr")) return `Prix local pour ${countryCode}. Les taxes applicables sont calculées lors du paiement.`;
  if (language.startsWith("pt")) return `Preço local para ${countryCode}. Os impostos aplicáveis são calculados no checkout.`;
  if (language === "de") return `Lokaler Preis für ${countryCode}. Anfallende Steuern werden beim Bezahlen berechnet.`;
  if (language === "it") return `Prezzo locale per ${countryCode}. Le imposte applicabili vengono calcolate al pagamento.`;
  if (language === "nl") return `Lokale prijs voor ${countryCode}. Eventuele belastingen worden bij het afrekenen berekend.`;
  return `Local price for ${countryCode}. Taxes, where applicable, are calculated at checkout.`;
}

export default function MembershipPageClient() {
  const { effectiveLanguage, preferences, t } = useInternationalPreferences();
  const language = resolveMembershipCopyLanguage(effectiveLanguage);
  const countryCode = (preferences.country || "us").toUpperCase();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{t("membership.label")}</p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">{t("membership.title")}</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">{t("branding.longDescription")}</p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-400">{t("branding.methodsClarification")}</p>
        <p className="mt-6 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {t("branding.publicDisclaimer")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/assessment" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            {t("membership.primaryLabel")}
          </Link>
          <Link href="/course-progress" className="rounded-xl border border-white/60 px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            {t("membership.secondaryLabel")}
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-4xl font-black">{t("membership.plansHeading")}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {publicMembershipPlans.map((plan) => {
              const copy = getMembershipPlanCopy(plan.id, language);
              const localizedPrice = getLocalizedCatalogPrice(plan.id, countryCode);
              const priceLabel = localizedPrice
                ? `${formatLocalizedPrice(localizedPrice, effectiveLanguage)} ${localizedPrice.currency}`
                : `${plan.currency} ${plan.monthlyPrice.toFixed(2)}`;

              return (
                <div key={plan.id} className="rounded-2xl border border-white/10 bg-white p-8 text-slate-950 shadow-xl">
                  <h3 className="text-3xl font-black">{copy.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{copy.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-black">{priceLabel}</span>
                    <span className="ml-2 text-slate-500">{copy.billingLabel}</span>
                  </div>
                  {localizedPrice && localizedPrice.currency !== "USD" && (
                    <p className="mt-2 text-xs text-slate-500">
                      {getLocalPriceNote(effectiveLanguage, countryCode)}
                    </p>
                  )}
                  <ul className="mt-8 space-y-3 text-left text-sm font-semibold text-slate-700">
                    <li>{plan.assessmentIncluded ? t("membership.yesLabel") : t("membership.noLabel")} - {getMembershipFeatureLabel("assessmentIncluded", language)}</li>
                    <li>{plan.marketplaceIncluded ? t("membership.yesLabel") : t("membership.noLabel")} - {getMembershipFeatureLabel("marketplaceIncluded", language)}</li>
                    <li>{plan.aiCoachIncluded ? t("membership.yesLabel") : t("membership.noLabel")} - {getMembershipFeatureLabel("aiCoachIncluded", language)}</li>
                    <li>{plan.downloadableCourses ? t("membership.yesLabel") : t("membership.noLabel")} - {getMembershipFeatureLabel("downloadableCourses", language)}</li>
                    <li>{plan.prioritySupport ? t("membership.yesLabel") : t("membership.noLabel")} - {getMembershipFeatureLabel("prioritySupport", language)}</li>
                  </ul>
                  {copy.legalNote && <p className="mt-6 text-xs leading-6 text-slate-500">{copy.legalNote}</p>}
                  <Link
                    href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
                    className="mt-10 inline-flex w-full justify-center rounded-xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800"
                  >
                    {copy.ctaLabel}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* TEMPORARY TEST ITEM — Square payment verification only, remove after end-to-end verification. */}
          <div className="mt-8 rounded-2xl border border-yellow-500/40 bg-yellow-900/10 p-6">
            <p className="mb-1 text-xs font-black uppercase tracking-widest text-yellow-400">
              ⚠ Temporary — Dev / QA Only
            </p>
            <h3 className="text-xl font-black">Square Payment Test</h3>
            <p className="mt-2 text-sm text-slate-400">
              $1.00 one-time charge to verify the Square production checkout
              and webhook pipeline. Not a membership offer.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Item ID: <code className="text-yellow-300">square-payment-test-001</code>
            </p>
            <div className="mt-4">
              <PaymentLinkCheckoutButton
                itemId="square-payment-test-001"
                countryCode={countryCode}
                label="Run $1.00 Square Test"
                className="inline-flex rounded-xl border border-yellow-500/60 bg-yellow-900/20 px-5 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-900/40 disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-black">{t(`membership.block${index}.title`)}</h3>
              <p className="mt-4 leading-7 text-slate-300">{t(`membership.block${index}.body`)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
