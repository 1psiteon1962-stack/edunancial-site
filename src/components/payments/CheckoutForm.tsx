"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import SquareCheckout from "@/components/payments/SquareCheckout";
import { useAuth } from "@/lib/authContext";
import {
  getMembershipFeatureLabel,
  getMembershipPlanCopy,
  resolveMembershipCopyLanguage,
} from "@/lib/membershipCopy";
import {
  membershipPlans,
  resolveMembershipPlanId,
  type MembershipPlan,
} from "@/types/membership";

interface CheckoutFormProps {
  plan: MembershipPlan;
  secureCheckoutEnabled: boolean;
}

export default function CheckoutForm({
  plan,
  secureCheckoutEnabled,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const { effectiveLanguage, t } = useInternationalPreferences();
  const language = resolveMembershipCopyLanguage(effectiveLanguage);
  const planCopy = getMembershipPlanCopy(plan.id, language);
  const yesLabel = "✓";
  const noLabel = "✗";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
      <h2 className="text-3xl font-bold">{planCopy.name}</h2>
      <p className="mt-2 text-slate-500">{t("checkout.reviewDetails")}</p>

      <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-6">
        <div className="flex justify-between">
          <span className="text-slate-600">{t("checkout.membership")}</span>
          <strong>{planCopy.name}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{t("checkout.billingPeriod")}</span>
          <strong>{planCopy.billingLabel}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{t("checkout.monthlyPrice")}</span>
          <strong>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </strong>
        </div>
        <hr className="border-slate-200" />
        <div className="flex justify-between text-lg font-bold">
          <span>{t("checkout.totalToday")}</span>
          <span>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <h3 className="font-bold text-slate-800">{t("checkout.planIncludes")}</h3>
        <p>{plan.assessmentIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("assessmentIncluded", language)}</p>
        <p>{plan.marketplaceIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("marketplaceIncluded", language)}</p>
        <p>{plan.aiCoachIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("aiCoachIncluded", language)}</p>
        <p>{plan.downloadableCourses ? yesLabel : noLabel} {getMembershipFeatureLabel("downloadableCourses", language)}</p>
        <p>{plan.prioritySupport ? yesLabel : noLabel} {getMembershipFeatureLabel("prioritySupport", language)}</p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {t("branding.publicDisclaimer")}
      </div>

      {!user && (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {t("checkout.signInBefore")} <Link href="/login" className="font-semibold underline">{t("checkout.signIn")}</Link>{" "}
          {t("checkout.or")} <Link href="/register" className="font-semibold underline">{t("checkout.createAccount")}</Link>{" "}
          {t("checkout.beforePurchasing")}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {t("checkout.accessVerification")}
      </div>

      {plan.showContactOnly ? (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-900">
          {planCopy.legalNote ?? t("checkout.requiresApproval")} {t("checkout.contactSupport")}
        </div>
      ) : secureCheckoutEnabled && user ? (
        <div className="mt-6">
          <SquareCheckout
            planId={plan.id}
            amount={plan.monthlyPrice}
            currency={plan.currency}
            planName={`${planCopy.name} ${t("checkout.planMembership")}`}
            memberEmail={user.email}
          />
        </div>
      ) : !user ? (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
          {t("checkout.signInBeforeCheckout")}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          {t("checkout.checkoutUnavailable")}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/membership"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-900 hover:border-slate-400"
        >
          {t("checkout.backToMembership")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white hover:bg-blue-800"
        >
          {plan.showContactOnly ? t("checkout.requestOrgApproval") : t("checkout.contactSupportCta")}
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">{t("checkout.cancelAnytime")}</p>
    </div>
  );
}

export function CheckoutPage({
  planId,
  secureCheckoutEnabled,
}: {
  planId?: string;
  secureCheckoutEnabled: boolean;
}) {
  const canonicalPlanId = resolveMembershipPlanId(planId);
  const selectedPlan =
    membershipPlans.find((plan) => plan.id === canonicalPlanId) ?? membershipPlans[0];
  const { effectiveLanguage, t } = useInternationalPreferences();
  const language = resolveMembershipCopyLanguage(effectiveLanguage);
  const selectedPlanCopy = getMembershipPlanCopy(selectedPlan.id, language);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <nav className="mb-8 flex gap-2 text-sm text-slate-400">
        <Link href="/membership" className="hover:text-white">
          {t("checkout.membership")}
        </Link>
        <span>/</span>
        <span className="text-white">{t("checkout.checkout")}</span>
      </nav>

      <h1 className="text-4xl font-black">{t("checkout.checkout")}</h1>
      <p className="mt-2 text-slate-400">
        {t("checkout.youSelected")} <strong className="text-white">{selectedPlanCopy.name}</strong>
        {t("checkout.planSuffix")}
      </p>

      <div className="mt-10">
        <CheckoutForm
          plan={selectedPlan}
          secureCheckoutEnabled={secureCheckoutEnabled}
        />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
        {[
          { icon: "🔒", text: t("checkout.sslEncryption") },
          { icon: "📋", text: t("checkout.cancelLabel") },
          { icon: "✅", text: t("checkout.accessGranted") },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
