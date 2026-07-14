"use client";

import Link from "next/link";

import { useNorthAmericaLaunchLanguage } from "@/components/international/BilingualContent";
import SquareCheckout from "@/components/payments/SquareCheckout";
import { useAuth } from "@/lib/authContext";
import { EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";
import { getMembershipFeatureLabel, getMembershipPlanCopy } from "@/lib/membershipCopy";
import { membershipPlans, type MembershipPlan } from "@/types/membership";

interface CheckoutFormProps {
  plan: MembershipPlan;
  secureCheckoutEnabled: boolean;
}

export default function CheckoutForm({
  plan,
  secureCheckoutEnabled,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const language = useNorthAmericaLaunchLanguage();
  const planCopy = getMembershipPlanCopy(plan.id, language);
  const yesLabel = language === "es" ? "✓" : "✓";
  const noLabel = language === "es" ? "✗" : "✗";

  if (plan.id === "beta") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
        <h2 className="text-3xl font-bold">{planCopy.name}</h2>
        <p className="mt-4 text-slate-600">
          {language === "es"
            ? "El acceso para probadores beta es solo por invitación. Use su correo aprobado y su número de pase durante el inicio de sesión para comenzar el período beta de 72 horas."
            : "Beta Tester access is invitation only. Use your approved email address and pass number during login to begin the 72-hour beta period."}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block w-full rounded-xl bg-blue-700 px-6 py-4 text-center font-bold text-white hover:bg-blue-800"
        >
          {language === "es" ? "Iniciar sesión para canjear acceso beta" : "Sign In to Redeem Beta Access"}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
      <h2 className="text-3xl font-bold">{planCopy.name}</h2>
      <p className="mt-2 text-slate-500">
        {language === "es" ? "Revise los detalles de su membresía antes de continuar." : "Review your membership details before continuing."}
      </p>

      <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-6">
        <div className="flex justify-between">
          <span className="text-slate-600">Membership</span>
          <strong>{planCopy.name}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{language === "es" ? "Periodo de facturación" : "Billing Period"}</span>
          <strong>{planCopy.billingLabel}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{language === "es" ? "Precio mensual" : "Monthly Price"}</span>
          <strong>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </strong>
        </div>
        <hr className="border-slate-200" />
        <div className="flex justify-between text-lg font-bold">
          <span>{language === "es" ? "Total hoy" : "Total Today"}</span>
          <span>
            ${plan.monthlyPrice.toFixed(2)} {plan.currency}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <h3 className="font-bold text-slate-800">{language === "es" ? "El plan incluye:" : "Plan Includes:"}</h3>
        <p>{plan.assessmentIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("assessmentIncluded", language)}</p>
        <p>{plan.marketplaceIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("marketplaceIncluded", language)}</p>
        <p>{plan.aiCoachIncluded ? yesLabel : noLabel} {getMembershipFeatureLabel("aiCoachIncluded", language)}</p>
        <p>{plan.downloadableCourses ? yesLabel : noLabel} {getMembershipFeatureLabel("downloadableCourses", language)}</p>
        <p>{plan.prioritySupport ? yesLabel : noLabel} {getMembershipFeatureLabel("prioritySupport", language)}</p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {language === "es"
          ? "Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada."
          : EDUNANCIAL_PUBLIC_DISCLAIMER}
      </div>

      {!user && (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {language === "es" ? (
            <>
              ⚠ Por favor <Link href="/login" className="font-semibold underline">inicie sesión</Link> o{" "}
              <Link href="/register" className="font-semibold underline">cree una cuenta</Link>{" "}
              antes de comprar.
            </>
          ) : (
            <>
              ⚠ Please <Link href="/login" className="font-semibold underline">sign in</Link> or{" "}
              <Link href="/register" className="font-semibold underline">create an account</Link>{" "}
              before purchasing.
            </>
          )}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        {language === "es"
          ? "El acceso solo se concede después de la verificación del pago en el servidor. Los redireccionamientos del navegador o las pantallas de confirmación del cliente no activan la membresía."
          : "Access is only granted after server-side payment verification. Browser redirects or client-side confirmation screens do not activate membership."}
      </div>

      {plan.showContactOnly ? (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-900">
          {planCopy.legalNote ?? (language === "es"
            ? "Esta membresía requiere aprobación antes de que pueda comenzar la facturación."
            : "This membership requires approval before billing can begin.")}{" "}
          {language === "es"
            ? "Contacte a soporte para confirmar elegibilidad y requisitos de incorporación."
            : "Contact support to confirm eligibility and onboarding requirements."}
        </div>
      ) : secureCheckoutEnabled && user ? (
        <div className="mt-6">
          <SquareCheckout
            planId={plan.id}
            amount={plan.monthlyPrice}
            currency={plan.currency}
            planName={`${planCopy.name} ${language === "es" ? "Membresía" : "Membership"}`}
          />
        </div>
      ) : !user ? (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
          {language === "es"
            ? "Inicie sesión antes de comenzar el pago para que cualquier pago verificado pueda vincularse a la cuenta correcta de Edunancial."
            : "Sign in before starting checkout so any verified payment can be attached to the correct Edunancial account."}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          {language === "es"
            ? "El pago en línea verificado para membresías no está disponible actualmente. Square sigue desactivado hasta que la verificación por webhook y la activación de membresías estén totalmente implementadas."
            : "Verified online membership checkout is currently unavailable. Square remains feature-flagged off until webhook verification and membership fulfillment are fully implemented."}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/membership"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-900 hover:border-slate-400"
        >
          {language === "es" ? "Volver a membresía" : "Back to Membership"}
        </Link>
        <Link
          href={plan.showContactOnly ? "/contact" : "/contact"}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white hover:bg-blue-800"
        >
          {plan.showContactOnly
            ? language === "es" ? "Solicitar aprobación de la organización" : "Request Organization Approval"
            : language === "es" ? "Contactar soporte" : "Contact Support"}
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        {language === "es"
          ? "Cancele en cualquier momento. Sin contratos obligatorios. Los pagos permanecen protegidos detrás de la confirmación verificada del servidor."
          : "Cancel anytime. No lock-in contracts. Payments stay gated behind verified server-side confirmation."}
      </p>
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
  const selectedPlan =
    membershipPlans.find((plan) => plan.id === planId) ?? membershipPlans[1];
  const language = useNorthAmericaLaunchLanguage();
  const selectedPlanCopy = getMembershipPlanCopy(selectedPlan.id, language);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <nav className="mb-8 flex gap-2 text-sm text-slate-400">
        <Link href="/membership" className="hover:text-white">
          {language === "es" ? "Membresía" : "Membership"}
        </Link>
        <span>/</span>
        <span className="text-white">{language === "es" ? "Pago" : "Checkout"}</span>
      </nav>

      <h1 className="text-4xl font-black">{language === "es" ? "Pago" : "Checkout"}</h1>
      <p className="mt-2 text-slate-400">
        {language === "es" ? "Seleccionó el plan " : "You selected the "}
        <strong className="text-white">{selectedPlanCopy.name}</strong>
        {language === "es" ? "." : " plan."}
      </p>

      <div className="mt-10">
        <CheckoutForm
          plan={selectedPlan}
          secureCheckoutEnabled={secureCheckoutEnabled}
        />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
        {[
          { icon: "🔒", text: language === "es" ? "Cifrado SSL de 256 bits" : "256-bit SSL encryption" },
          { icon: "📋", text: language === "es" ? "Cancele en cualquier momento" : "Cancel anytime" },
          { icon: "✅", text: language === "es" ? "Acceso otorgado solo después de pago verificado" : "Access granted only after verified payment" },
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
