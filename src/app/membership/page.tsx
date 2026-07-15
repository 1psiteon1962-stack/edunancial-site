import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import {
  EDUNANCIAL_LONG_DESCRIPTION,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";
import { getMembershipFeatureLabel, getMembershipPlanCopy } from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

export const metadata = {
  title: "Edunancial Membership | Financial Literacy Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
};

function MembershipLayout({
  label,
  title,
  description,
  methods,
  disclaimer,
  primaryLabel,
  secondaryLabel,
  plansHeading,
  language,
  yesLabel,
  blocks,
}: {
  label: string;
  title: string;
  description: string;
  methods: string;
  disclaimer: string;
  primaryLabel: string;
  secondaryLabel: string;
  plansHeading: string;
  language: "en" | "es" | "fr-CA" | "fr-FR";
  yesLabel: string;
  blocks: [string, string][];
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">{title}</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">{description}</p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-400">{methods}</p>
        <p className="mt-6 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {disclaimer}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/assessment" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            {primaryLabel}
          </Link>
          <Link href="/course-progress" className="rounded-xl border border-white/60 px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            {secondaryLabel}
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-4xl font-black">{plansHeading}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {publicMembershipPlans.map((plan) => {
              const copy = getMembershipPlanCopy(plan.id, language);
              return (
                <div key={plan.id} className="rounded-2xl border border-white/10 bg-white p-8 text-slate-950 shadow-xl">
                  <h3 className="text-3xl font-black">{copy.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{copy.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-black">${plan.monthlyPrice.toFixed(2)}</span>
                    <span className="ml-2 text-slate-500">{copy.billingLabel}</span>
                  </div>
                  <ul className="mt-8 space-y-3 text-left text-sm font-semibold text-slate-700">
                    <li>{plan.assessmentIncluded ? yesLabel : "No"} - {getMembershipFeatureLabel("assessmentIncluded", language)}</li>
                    <li>{plan.marketplaceIncluded ? yesLabel : "No"} - {getMembershipFeatureLabel("marketplaceIncluded", language)}</li>
                    <li>{plan.aiCoachIncluded ? yesLabel : "No"} - {getMembershipFeatureLabel("aiCoachIncluded", language)}</li>
                    <li>{plan.downloadableCourses ? yesLabel : "No"} - {getMembershipFeatureLabel("downloadableCourses", language)}</li>
                    <li>{plan.prioritySupport ? yesLabel : "No"} - {getMembershipFeatureLabel("prioritySupport", language)}</li>
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {blocks.map(([blockTitle, body]) => (
            <div key={blockTitle} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-black">{blockTitle}</h3>
              <p className="mt-4 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function MembershipPage() {
  return (
    <BilingualContent
      en={
        <MembershipLayout
          label="Membership"
          title="Become an Edunancial member and build practical financial literacy and financial competency."
          description={EDUNANCIAL_LONG_DESCRIPTION}
          methods={EDUNANCIAL_METHODS_CLARIFICATION}
          disclaimer={EDUNANCIAL_PUBLIC_DISCLAIMER}
          primaryLabel="Start Assessment"
          secondaryLabel="View Progress Tracking"
          plansHeading="Choose your starting point."
          language="en"
          yesLabel="Yes"
          blocks={[
            ["Learn", "Structured learning resources across real estate, paper assets, and business."],
            ["Assess", "Measure your financial competency and track improvement."],
            ["Apply", "Use practical exercises and member tools to convert lessons into decisions."],
            ["Grow", "Build habits designed to support long-term financial progress."],
          ]}
        />
      }
      es={
        <MembershipLayout
          label="Membresía"
          title="Hágase miembro de Edunancial y convierta la alfabetización financiera en competencia financiera práctica."
          description="Edunancial es una plataforma de membresía dedicada a mejorar la alfabetización financiera y la competencia financiera mediante recursos estructurados, herramientas interactivas, ejercicios prácticos y métodos apoyados por tecnología."
          methods="Edunancial puede usar rutas de aprendizaje estructuradas, preguntas socráticas, inteligencia artificial, repetición, tarjetas de estudio, cuestionarios y ejercicios prácticos para ayudar a los miembros a mejorar su alfabetización financiera y su competencia financiera."
          disclaimer="Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada."
          primaryLabel="Iniciar evaluación"
          secondaryLabel="Ver seguimiento de progreso"
          plansHeading="Elija su punto de partida."
          language="es"
          yesLabel="Sí"
          blocks={[
            ["Aprender", "Recursos estructurados de aprendizaje sobre bienes raíces, activos financieros y negocios."],
            ["Evaluar", "Mida su competencia financiera y dé seguimiento a la mejora."],
            ["Aplicar", "Use ejercicios prácticos y herramientas para convertir lecciones en decisiones."],
            ["Crecer", "Construya hábitos diseñados para impulsar el progreso financiero a largo plazo."],
          ]}
        />
      }
      fr={
        <MembershipLayout
          label="Abonnement"
          title="Devenez membre d'Edunancial et développez une littératie financière et une compétence financière pratiques."
          description="Edunancial est une plateforme d'abonnement consacrée à l'amélioration de la littératie financière et de la compétence financière grâce à des ressources d'apprentissage structurées, des outils interactifs, des exercices pratiques et des méthodes soutenues par la technologie."
          methods="Edunancial peut utiliser des parcours d'apprentissage structurés, le questionnement socratique, l'intelligence artificielle, la répétition, des cartes mémoire, des questionnaires et des exercices pratiques pour aider les membres à améliorer leur littératie financière et leur compétence financière."
          disclaimer="Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé."
          primaryLabel="Commencer l'évaluation"
          secondaryLabel="Voir le suivi de progression"
          plansHeading="Choisissez votre point de départ."
          language="fr-CA"
          yesLabel="Oui"
          blocks={[
            ["Apprendre", "Des ressources d'apprentissage structurées en immobilier, actifs financiers et affaires."],
            ["Évaluer", "Mesurez votre compétence financière et suivez votre progression."],
            ["Appliquer", "Utilisez des exercices pratiques et des outils pour membres afin de transformer les leçons en décisions."],
            ["Progresser", "Développez des habitudes conçues pour soutenir un progrès financier à long terme."],
          ]}
        />
      }
      frFR={
        <MembershipLayout
          label="Abonnement"
          title="Devenez membre d'Edunancial et développez une littératie financière et une compétence financière pratiques."
          description="Edunancial est une plateforme d'abonnement consacrée à l'amélioration de la littératie financière et de la compétence financière grâce à des ressources d'apprentissage structurées, des outils interactifs, des exercices pratiques et des méthodes soutenues par la technologie."
          methods="Edunancial peut utiliser des parcours d'apprentissage structurés, le questionnement socratique, l'intelligence artificielle, la répétition, des cartes mémoire, des questionnaires et des exercices pratiques pour aider les membres à améliorer leur littératie financière et leur compétence financière."
          disclaimer="Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé."
          primaryLabel="Commencer l'évaluation"
          secondaryLabel="Voir le suivi de progression"
          plansHeading="Choisissez votre point de départ."
          language="fr-FR"
          yesLabel="Oui"
          blocks={[
            ["Apprendre", "Des ressources d'apprentissage structurées en immobilier, actifs financiers et affaires."],
            ["Évaluer", "Mesurez votre compétence financière et suivez votre progression."],
            ["Appliquer", "Utilisez des exercices pratiques et des outils pour membres afin de transformer les leçons en décisions."],
            ["Progresser", "Développez des habitudes conçues pour soutenir un progrès financier à long terme."],
          ]}
        />
      }
    />
  );
}
