"use client";

import Link from "next/link";

import {
  type NorthAmericaLaunchLanguage,
  useNorthAmericaLaunchLanguage,
} from "@/components/international/BilingualContent";
import SquareCheckout from "@/components/payments/SquareCheckout";
import { useAuth } from "@/lib/authContext";
import { getMembershipFeatureLabel, getMembershipPlanCopy } from "@/lib/membershipCopy";
import { EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";
import {
  membershipPlans,
  resolveMembershipPlanId,
  type MembershipPlan,
} from "@/types/membership";

interface CheckoutFormProps {
  plan: MembershipPlan;
  secureCheckoutEnabled: boolean;
}

const copy = {
  reviewDetails: { en: "Review your membership details before continuing.", es: "Revise los detalles de su membresía antes de continuar.", "fr-CA": "Vérifiez les détails de votre abonnement avant de continuer.", "fr-FR": "Vérifiez les détails de votre abonnement avant de continuer." },
  billingPeriod: { en: "Billing Period", es: "Periodo de facturación", "fr-CA": "Période de facturation", "fr-FR": "Période de facturation" },
  monthlyPrice: { en: "Monthly Price", es: "Precio mensual", "fr-CA": "Prix mensuel", "fr-FR": "Prix mensuel" },
  totalToday: { en: "Total Today", es: "Total hoy", "fr-CA": "Total aujourd'hui", "fr-FR": "Total aujourd'hui" },
  planIncludes: { en: "Plan Includes:", es: "El plan incluye:", "fr-CA": "Le plan comprend :", "fr-FR": "Le plan comprend :" },
  signIn: { en: "sign in", es: "inicie sesión", "fr-CA": "connectez-vous", "fr-FR": "connectez-vous" },
  createAccount: { en: "create an account", es: "cree una cuenta", "fr-CA": "créez un compte", "fr-FR": "créez un compte" },
  signInBefore: { en: "⚠ Please", es: "⚠ Por favor", "fr-CA": "⚠ Veuillez", "fr-FR": "⚠ Veuillez" },
  beforePurchasing: { en: "before purchasing.", es: "antes de comprar.", "fr-CA": "avant d'acheter.", "fr-FR": "avant d'acheter." },
  accessVerification: { en: "Access is only granted after server-side payment verification. Browser redirects or client-side confirmation screens do not activate membership.", es: "El acceso solo se concede después de la verificación del pago en el servidor. Los redireccionamientos del navegador o las pantallas de confirmación del cliente no activan la membresía.", "fr-CA": "L'accès n'est accordé qu'après la vérification du paiement côté serveur. Les redirections du navigateur ou les écrans de confirmation côté client n'activent pas l'abonnement.", "fr-FR": "L'accès n'est accordé qu'après la vérification du paiement côté serveur. Les redirections du navigateur ou les écrans de confirmation côté client n'activent pas l'abonnement." },
  requiresApproval: { en: "This membership requires approval before billing can begin.", es: "Esta membresía requiere aprobación antes de que pueda comenzar la facturación.", "fr-CA": "Cet abonnement nécessite une approbation avant que la facturation puisse commencer.", "fr-FR": "Cet abonnement nécessite une approbation avant que la facturation puisse commencer." },
  contactSupport: { en: "Contact support to confirm eligibility and onboarding requirements.", es: "Contacte a soporte para confirmar elegibilidad y requisitos de incorporación.", "fr-CA": "Contactez le support pour confirmer l'éligibilité et les conditions d'intégration.", "fr-FR": "Contactez le support pour confirmer l'éligibilité et les conditions d'intégration." },
  signInBefore2: { en: "Sign in before starting checkout so any verified payment can be attached to the correct Edunancial account.", es: "Inicie sesión antes de comenzar el pago para que cualquier pago verificado pueda vincularse a la cuenta correcta de Edunancial.", "fr-CA": "Connectez-vous avant de commencer le paiement afin que tout paiement vérifié puisse être associé au bon compte Edunancial.", "fr-FR": "Connectez-vous avant de commencer le paiement afin que tout paiement vérifié puisse être associé au bon compte Edunancial." },
  checkoutUnavailable: { en: "Verified online membership checkout is unavailable in the current environment configuration. Confirm Square credentials, webhook signature settings, and the SQUARE_VERIFIED_CHECKOUT_ENABLED flag.", es: "El pago en línea verificado para membresías no está disponible con la configuración actual del entorno. Verifique credenciales de Square, firma de webhook y el indicador SQUARE_VERIFIED_CHECKOUT_ENABLED.", "fr-CA": "Le paiement d'abonnement en ligne vérifié n'est pas disponible dans la configuration actuelle de l'environnement. Vérifiez les identifiants Square, les paramètres de signature webhook et le drapeau SQUARE_VERIFIED_CHECKOUT_ENABLED.", "fr-FR": "Le paiement d'abonnement en ligne vérifié n'est pas disponible dans la configuration actuelle de l'environnement. Vérifiez les identifiants Square, les paramètres de signature webhook et le drapeau SQUARE_VERIFIED_CHECKOUT_ENABLED." },
  backToMembership: { en: "Back to Membership", es: "Volver a membresía", "fr-CA": "Retour à l'abonnement", "fr-FR": "Retour à l'abonnement" },
  requestOrgApproval: { en: "Request Organization Approval", es: "Solicitar aprobación de la organización", "fr-CA": "Demander l'approbation de l'organisation", "fr-FR": "Demander l'approbation de l'organisation" },
  contactSupport2: { en: "Contact Support", es: "Contactar soporte", "fr-CA": "Contacter le support", "fr-FR": "Contacter le support" },
  cancelAnytime: { en: "Cancel anytime. No lock-in contracts. Payments stay gated behind verified server-side confirmation.", es: "Cancele en cualquier momento. Sin contratos obligatorios. Los pagos permanecen protegidos detrás de la confirmación verificada del servidor.", "fr-CA": "Annulez à tout moment. Sans contrat d'engagement. Les paiements restent protégés derrière la confirmation vérifiée côté serveur.", "fr-FR": "Annulez à tout moment. Sans contrat d'engagement. Les paiements restent protégés derrière la confirmation vérifiée côté serveur." },
  membership: { en: "Membership", es: "Membresía", "fr-CA": "Abonnement", "fr-FR": "Abonnement" },
  checkout: { en: "Checkout", es: "Pago", "fr-CA": "Paiement", "fr-FR": "Paiement" },
  youSelected: { en: "You selected the", es: "Seleccionó el plan", "fr-CA": "Vous avez sélectionné le", "fr-FR": "Vous avez sélectionné le" },
  plan: { en: " plan.", es: ".", "fr-CA": " plan.", "fr-FR": " plan." },
  planMembership: { en: "Membership", es: "Membresía", "fr-CA": "Adhésion", "fr-FR": "Adhésion" },
  sslEncryption: { en: "256-bit SSL encryption", es: "Cifrado SSL de 256 bits", "fr-CA": "Chiffrement SSL 256 bits", "fr-FR": "Chiffrement SSL 256 bits" },
  cancelLabel: { en: "Cancel anytime", es: "Cancele en cualquier momento", "fr-CA": "Annulez à tout moment", "fr-FR": "Annulez à tout moment" },
  accessGranted: { en: "Access granted only after verified payment", es: "Acceso otorgado solo después de pago verificado", "fr-CA": "Accès accordé uniquement après paiement vérifié", "fr-FR": "Accès accordé uniquement après paiement vérifié" },
  disclaimer: { en: "", es: "Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada.", "fr-CA": "Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé.", "fr-FR": "Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé." },
} as const;

type CopyKey = keyof typeof copy;

function createTranslator(language: NorthAmericaLaunchLanguage) {
  return function t(key: CopyKey): string {
    return copy[key][language] ?? copy[key].en;
  };
}

function getPublicDisclaimer(language: NorthAmericaLaunchLanguage) {
  if (language === "es" || language === "fr-CA" || language === "fr-FR") {
    return copy.disclaimer[language];
  }

  return EDUNANCIAL_PUBLIC_DISCLAIMER;
}

export default function CheckoutForm({
  plan,
  secureCheckoutEnabled,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const language = useNorthAmericaLaunchLanguage();
  const planCopy = getMembershipPlanCopy(plan.id, language);
  const t = createTranslator(language);
  const yesLabel = "✓";
  const noLabel = "✗";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
      <h2 className="text-3xl font-bold">{planCopy.name}</h2>
      <p className="mt-2 text-slate-500">{t("reviewDetails")}</p>

      <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-6">
        <div className="flex justify-between">
          <span className="text-slate-600">{t("membership")}</span>
          <strong>{planCopy.name}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{t("billingPeriod")}</span>
          <strong>{planCopy.billingLabel}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{t("monthlyPrice")}</span>
          <strong>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </strong>
        </div>
        <hr className="border-slate-200" />
        <div className="flex justify-between text-lg font-bold">
          <span>{t("totalToday")}</span>
          <span>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <h3 className="font-bold text-slate-800">{t("planIncludes")}</h3>
        <p>{plan.assessmentIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("assessmentIncluded", language)}</p>
        <p>{plan.marketplaceIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("marketplaceIncluded", language)}</p>
        <p>{plan.aiCoachIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("aiCoachIncluded", language)}</p>
        <p>{plan.downloadableCourses ? yesLabel : noLabel} {getMembershipFeatureLabel("downloadableCourses", language)}</p>
        <p>{plan.prioritySupport ? yesLabel : noLabel} {getMembershipFeatureLabel("prioritySupport", language)}</p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {getPublicDisclaimer(language)}
      </div>

      {!user && (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {t("signInBefore")} <Link href="/login" className="font-semibold underline">{t("signIn")}</Link> or{" "}
          <Link href="/register" className="font-semibold underline">{t("createAccount")}</Link>{" "}
          {t("beforePurchasing")}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {t("accessVerification")}
      </div>

      {plan.showContactOnly ? (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-900">
          {planCopy.legalNote ?? t("requiresApproval")} {t("contactSupport")}
        </div>
      ) : secureCheckoutEnabled && user ? (
        <div className="mt-6">
          <SquareCheckout
            planId={plan.id}
            amount={plan.monthlyPrice}
            currency={plan.currency}
            planName={`${planCopy.name} ${t("planMembership")}`}
            memberEmail={user.email}
          />
        </div>
      ) : !user ? (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
          {t("signInBefore2")}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          {t("checkoutUnavailable")}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/membership"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-900 hover:border-slate-400"
        >
          {t("backToMembership")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white hover:bg-blue-800"
        >
          {plan.showContactOnly ? t("requestOrgApproval") : t("contactSupport2")}
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">{t("cancelAnytime")}</p>
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
  const language = useNorthAmericaLaunchLanguage();
  const selectedPlanCopy = getMembershipPlanCopy(selectedPlan.id, language);
  const t = createTranslator(language);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <nav className="mb-8 flex gap-2 text-sm text-slate-400">
        <Link href="/membership" className="hover:text-white">
          {t("membership")}
        </Link>
        <span>/</span>
        <span className="text-white">{t("checkout")}</span>
      </nav>

      <h1 className="text-4xl font-black">{t("checkout")}</h1>
      <p className="mt-2 text-slate-400">
        {t("youSelected")} <strong className="text-white">{selectedPlanCopy.name}</strong>{t("plan")}
      </p>

      <div className="mt-10">
        <CheckoutForm
          plan={selectedPlan}
          secureCheckoutEnabled={secureCheckoutEnabled}
        />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
        {[
          { icon: "🔒", text: t("sslEncryption") },
          { icon: "📋", text: t("cancelLabel") },
          { icon: "✅", text: t("accessGranted") },
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
