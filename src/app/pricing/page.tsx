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

function PricingLayout({
  label,
  title,
  intro,
  disclaimer,
  freePlan,
  enterprisePlan,
  betaNote,
  primaryLabel,
  secondaryLabel,
  language,
}: {
  label: string;
  title: string;
  intro: string;
  disclaimer: string;
  freePlan: { name: string; priceDisplay: string; billingLabel: string; description: string; ctaLabel: string };
  enterprisePlan: { name: string; priceDisplay: string; billingLabel: string; description: string; ctaLabel: string };
  betaNote: string;
  primaryLabel: string;
  secondaryLabel: string;
  language: "en" | "es" | "fr-CA" | "fr-FR";
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">{title}</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">{intro}</p>
        <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {disclaimer}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{freePlan.name}</p>
            <p className="mt-4 text-4xl font-black">{freePlan.priceDisplay}</p>
            <p className="mt-2 text-sm text-slate-400">{freePlan.billingLabel}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{freePlan.description}</p>
            <Link href="/register" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              {freePlan.ctaLabel}
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
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{enterprisePlan.name}</p>
            <p className="mt-4 text-4xl font-black">{enterprisePlan.priceDisplay}</p>
            <p className="mt-2 text-sm text-slate-400">{enterprisePlan.billingLabel}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{enterprisePlan.description}</p>
            <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              {enterprisePlan.ctaLabel}
            </Link>
          </div>
        </div>
        <p className="mt-8 text-sm text-slate-400">{betaNote}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PricingTable />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300">
            {primaryLabel}
          </Link>
          <Link href="/contact" className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950">
            {secondaryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PricingPage() {
  return (
    <BilingualContent
      en={
        <PricingLayout
          label="Pricing"
          title="Membership pricing built for individuals and approved organizations."
          intro={`${EDUNANCIAL_IDENTITY} Choose the plan that fits your needs — from free access to individual membership, approved organization rates, and enterprise agreements.`}
          disclaimer={EDUNANCIAL_PUBLIC_DISCLAIMER}
          freePlan={{
            name: "Free",
            priceDisplay: "$0",
            billingLabel: "no credit card required",
            description: "Create a free Edunancial account to explore public financial literacy content, track your progress, and access introductory resources at no cost.",
            ctaLabel: "Get started free",
          }}
          enterprisePlan={{
            name: "Enterprise",
            priceDisplay: "Custom Quote",
            billingLabel: "contact us for pricing",
            description: "For large organizations, government agencies, and enterprise partners requiring custom agreements, dedicated support, white-label options, or volume rates beyond standard tiers.",
            ctaLabel: "Contact for enterprise pricing",
          }}
          betaNote="Beta Tester access is invitation only, priced at $0, and intentionally hidden from public pricing cards. Minimum pricing for any paid plan is $9.99 per member/month."
          primaryLabel="View Membership Details"
          secondaryLabel="Contact Sales & Support"
          language="en"
        />
      }
      es={
        <PricingLayout
          label="Precios"
          title="Precios de membresía pensados para personas y organizaciones aprobadas."
          intro="Edunancial es una plataforma de membresía de alfabetización financiera y competencia financiera. Elija el plan que mejor se adapte a su necesidad: acceso gratuito, membresía individual, tarifas para organizaciones aprobadas y acuerdos empresariales."
          disclaimer="Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial regulada."
          freePlan={{
            name: "Gratis",
            priceDisplay: "$0",
            billingLabel: "sin tarjeta de crédito",
            description: "Cree una cuenta gratuita de Edunancial para explorar contenido público, seguir su progreso y acceder a recursos introductorios sin costo.",
            ctaLabel: "Empezar gratis",
          }}
          enterprisePlan={{
            name: "Empresarial",
            priceDisplay: "Cotización personalizada",
            billingLabel: "contáctenos para precios",
            description: "Para organizaciones grandes, agencias gubernamentales y socios empresariales que requieren acuerdos personalizados, soporte dedicado u opciones de volumen.",
            ctaLabel: "Contactar para precio empresarial",
          }}
          betaNote="El acceso beta es solo por invitación, cuesta $0 y se mantiene oculto de las tarjetas públicas de precios. El precio mínimo de cualquier plan de pago es de $9.99 por miembro al mes."
          primaryLabel="Ver detalles de membresía"
          secondaryLabel="Contactar ventas y soporte"
          language="es"
        />
      }
      fr={
        <PricingLayout
          label="Tarifs"
          title="Des tarifs d'abonnement conçus pour les particuliers et les organisations approuvées."
          intro="Edunancial est une plateforme d'abonnement en littératie financière et compétence financière. Choisissez le plan qui correspond à vos besoins : accès gratuit, abonnement individuel, tarifs pour organisations approuvées et ententes d'entreprise."
          disclaimer="Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre réglementé."
          freePlan={{
            name: "Gratuit",
            priceDisplay: "$0",
            billingLabel: "aucune carte de crédit requise",
            description: "Créez un compte Edunancial gratuit pour explorer le contenu public de littératie financière, suivre votre progression et accéder à des ressources d'introduction sans frais.",
            ctaLabel: "Commencer gratuitement",
          }}
          enterprisePlan={{
            name: "Entreprise",
            priceDisplay: "Sur devis",
            billingLabel: "contactez-nous pour les tarifs",
            description: "Pour les grandes organisations, les agences gouvernementales et les partenaires d'entreprise ayant besoin d'ententes personnalisées, d'un support dédié ou d'options à volume.",
            ctaLabel: "Contacter pour les tarifs entreprise",
          }}
          betaNote="L'accès bêta est sur invitation seulement, au prix de 0 $, et reste volontairement masqué des cartes tarifaires publiques. Le prix minimal pour tout plan payant est de 9,99 $ par membre/mois."
          primaryLabel="Voir les détails de l'abonnement"
          secondaryLabel="Contacter les ventes et le support"
          language="fr-CA"
        />
      }
      frFR={
        <PricingLayout
          label="Tarifs"
          title="Des tarifs clairs pour la littératie et la compétence financières."
          intro="Edunancial est une plateforme d'abonnement en littératie financière et compétence financière. Choisissez le plan qui correspond à vos besoins : accès gratuit, abonnement individuel, tarifs pour organisations approuvées et accords d'entreprise."
          disclaimer="Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre réglementé."
          freePlan={{
            name: "Gratuit",
            priceDisplay: "$0",
            billingLabel: "aucune carte bancaire requise",
            description: "Créez un compte Edunancial gratuit pour explorer le contenu public de littératie financière, suivre votre progression et accéder à des ressources d'introduction sans frais.",
            ctaLabel: "Commencer gratuitement",
          }}
          enterprisePlan={{
            name: "Entreprise",
            priceDisplay: "Sur devis",
            billingLabel: "contactez-nous pour les tarifs",
            description: "Pour les grandes organisations, les agences gouvernementales et les partenaires d'entreprise nécessitant des accords personnalisés, un support dédié ou des options à volume.",
            ctaLabel: "Contacter pour les tarifs entreprise",
          }}
          betaNote="L'accès bêta est sur invitation seulement, au prix de 0 $, et reste volontairement masqué des grilles tarifaires publiques. Le prix minimal pour tout plan payant est de 9,99 $ par membre/mois."
          primaryLabel="Voir les détails de l'abonnement"
          secondaryLabel="Contacter les ventes et le support"
          language="fr-FR"
        />
      }
    />
  );
}
