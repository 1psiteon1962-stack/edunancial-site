import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import PricingTable from "@/components/membership/PricingTable";
import { EDUNANCIAL_IDENTITY, EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";
import { getMembershipPlanCopy } from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

export const metadata = {
  title: "Pricing | Edunancial",
  description:
    "Compare Edunancial membership pricing, approved organization rates, and beta-access rules.",
};

const freePlan = {
  id: "free",
  name: "Free",
  priceDisplay: "$0",
  billingLabel: "no credit card required",
  description:
    "Create a free Edunancial account to explore public financial literacy content, track your progress, and access introductory resources at no cost.",
  ctaLabel: "Get started free",
  ctaHref: "/register",
  featured: false,
} as const;

const enterprisePlan = {
  id: "enterprise-custom",
  name: "Enterprise",
  priceDisplay: "Custom Quote",
  billingLabel: "contact us for pricing",
  description:
    "For large organizations, government agencies, and enterprise partners requiring custom agreements, dedicated support, white-label options, or volume rates beyond standard tiers.",
  ctaLabel: "Contact for enterprise pricing",
  ctaHref: "/contact",
  featured: false,
} as const;

export default function PricingPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-7xl px-6 py-24">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Pricing</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
              Membership pricing built for individuals and approved organizations.
            </h1>
            <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
              {EDUNANCIAL_IDENTITY} Choose the plan that fits your needs — from free access to
              individual membership, approved organization rates, and enterprise agreements.
            </p>
            <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              {EDUNANCIAL_PUBLIC_DISCLAIMER}
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{freePlan.name}</p>
                <p className="mt-4 text-4xl font-black">{freePlan.priceDisplay}</p>
                <p className="mt-2 text-sm text-slate-400">{freePlan.billingLabel}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{freePlan.description}</p>
                <Link href={freePlan.ctaHref} className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                  {freePlan.ctaLabel}
                </Link>
              </div>

              {publicMembershipPlans.map((plan) => {
                const copy = getMembershipPlanCopy(plan.id, "en");
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border p-6 ${
                      plan.featured ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-slate-900/80"
                    }`}
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
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{enterprisePlan.name}</p>
                <p className="mt-4 text-4xl font-black">{enterprisePlan.priceDisplay}</p>
                <p className="mt-2 text-sm text-slate-400">{enterprisePlan.billingLabel}</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">{enterprisePlan.description}</p>
                <Link href={enterprisePlan.ctaHref} className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                  {enterprisePlan.ctaLabel}
                </Link>
              </div>
            </div>
            <p className="mt-8 text-sm text-slate-400">
              Beta Tester access is invitation only, priced at $0, and intentionally hidden from public pricing cards.
              Minimum pricing for any paid plan is $9.99 per member/month.
            </p>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-24">
            <PricingTable />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/membership" className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300">
                View Membership Details
              </Link>
              <Link href="/contact" className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950">
                Contact Sales &amp; Support
              </Link>
            </div>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-7xl px-6 py-24">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Precios</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
              Precios de membresía pensados para personas y organizaciones aprobadas.
            </h1>
            <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
              Edunancial es una plataforma de membresía de alfabetización financiera y competencia financiera. Elija el plan que mejor se adapte a su necesidad: acceso gratuito, membresía individual, tarifas para organizaciones aprobadas y acuerdos empresariales.
            </p>
            <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              Edunancial no es una escuela, colegio, universidad, institución vocacional,
              institución educativa acreditada ni una institución que otorgue títulos. La membresía
              no produce un grado académico, diploma, licencia profesional ni una credencial regulada.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">Gratis</p>
                <p className="mt-4 text-4xl font-black">$0</p>
                <p className="mt-2 text-sm text-slate-400">sin tarjeta de crédito</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Cree una cuenta gratuita de Edunancial para explorar contenido público, seguir su progreso y acceder a recursos introductorios sin costo.
                </p>
                <Link href="/register" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                  Empezar gratis
                </Link>
              </div>

              {publicMembershipPlans.map((plan) => {
                const copy = getMembershipPlanCopy(plan.id, "es");
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border p-6 ${
                      plan.featured ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-slate-900/80"
                    }`}
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
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">Empresarial</p>
                <p className="mt-4 text-4xl font-black">Cotización personalizada</p>
                <p className="mt-2 text-sm text-slate-400">contáctenos para precios</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Para organizaciones grandes, agencias gubernamentales y socios empresariales que
                  requieren acuerdos personalizados, soporte dedicado u opciones de volumen.
                </p>
                <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                  Contactar para precio empresarial
                </Link>
              </div>
            </div>
            <p className="mt-8 text-sm text-slate-400">
              El acceso beta es solo por invitación, cuesta $0 y se mantiene oculto de las tarjetas
              públicas de precios. El precio mínimo de cualquier plan de pago es de $9.99 por
              miembro al mes.
            </p>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-24">
            <PricingTable />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/membership" className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300">
                Ver detalles de membresía
              </Link>
              <Link href="/contact" className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950">
                Contactar ventas y soporte
              </Link>
            </div>
          </section>
        </main>
      }
    />
  );
}
