import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Terms of Use | Edunancial",
  description:
    "Review the Edunancial Terms of Use for membership access, acceptable use, disclaimers, and legal protections.",
};

const lastUpdated = "July 12, 2026";

function TermsSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-3xl font-black text-white">{title}</h2>
      <p className="mt-4 leading-8">{body}</p>
    </section>
  );
}

function TermsLayout({
  label,
  title,
  updatedLabel,
  summaryBoxClass,
  summaryIntro,
  summaryDisclaimer,
  summaryMethods,
  sections,
  contactLead,
  contactLink,
}: {
  label: string;
  title: string;
  updatedLabel: string;
  summaryBoxClass: string;
  summaryIntro: string;
  summaryDisclaimer: string;
  summaryMethods: string;
  sections: { title: string; body: string }[];
  contactLead: string;
  contactLink: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black">{title}</h1>
        <p className="mt-4 text-slate-400">{updatedLabel}: {lastUpdated}</p>

        <div className={`mt-8 rounded-2xl p-6 text-sm leading-7 ${summaryBoxClass}`}>
          <p>{summaryIntro}</p>
          <p className="mt-4">{summaryDisclaimer}</p>
          <p className="mt-4">{summaryMethods}</p>
        </div>

        <div className="mt-10 space-y-10 text-slate-300">
          {sections.map((section) => (
            <TermsSection key={section.title} title={section.title} body={section.body} />
          ))}
          <section>
            <h2 className="text-3xl font-black text-white">9. Contact</h2>
            <p className="mt-4 leading-8">
              {contactLead}{" "}
              <Link href="/contact" className="text-blue-300 underline">
                {contactLink}
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function TermsPage() {
  return (
    <BilingualContent
      en={
        <TermsLayout
          label="Legal"
          title="Terms of Use"
          updatedLabel="Last updated"
          summaryBoxClass="border border-white/10 bg-white/5 text-slate-300"
          summaryIntro={EDUNANCIAL_IDENTITY}
          summaryDisclaimer={EDUNANCIAL_PUBLIC_DISCLAIMER}
          summaryMethods={EDUNANCIAL_METHODS_CLARIFICATION}
          sections={[
            { title: "1. Membership Platform Use", body: "By using Edunancial, you agree to use the platform only for lawful personal, household, or approved organizational purposes. You may access Edunancial through memberships, approved organizational arrangements, or invitation-only beta access where offered." },
            { title: "2. No Academic or Professional Credential", body: EDUNANCIAL_PUBLIC_DISCLAIMER },
            { title: "3. Financial, Legal, and Tax Disclaimer", body: "Edunancial provides informational content only. Nothing on the platform is legal, tax, accounting, investment, insurance, fiduciary, or financial advice, and nothing creates an advisor-client or similar professional relationship." },
            { title: "4. Accounts and Security", body: "You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. We may suspend or revoke access for fraud, abuse, unauthorized sharing, or violation of these Terms of Use." },
            { title: "5. Payments and Billing", body: "Paid membership access is granted only after verified payment confirmation. Approved organization memberships and 100+ member organization rates may require manual review, approval, and formal organizational agreements before access or invoicing begins." },
            { title: "6. Beta Access", body: "Beta Tester access is invitation only, personal to the approved email address, single-use, revocable, and limited in duration. See the Beta Terms for additional details." },
            { title: "7. Intellectual Property", body: "All Edunancial platform content, software, graphics, assessments, structured learning resources, and other materials are protected by applicable intellectual property laws. No license is granted except for your limited right to access the service as permitted by your membership." },
            { title: "8. Limitation of Liability", body: "To the maximum extent permitted by law, Edunancial is not liable for indirect, incidental, special, consequential, or punitive damages, or for decisions you make using platform content, tools, or outputs." },
          ]}
          contactLead="Questions about these Terms of Use can be sent through our"
          contactLink="contact page"
        />
      }
      es={
        <TermsLayout
          label="Legal"
          title="Términos de uso"
          updatedLabel="Actualizado por última vez"
          summaryBoxClass="border border-white/10 bg-white/5 text-slate-300"
          summaryIntro="Edunancial es una plataforma de membresía de alfabetización financiera y competencia financiera."
          summaryDisclaimer="Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada."
          summaryMethods="Edunancial puede usar rutas de aprendizaje estructuradas, preguntas socráticas, inteligencia artificial, repetición, tarjetas de estudio, cuestionarios y ejercicios prácticos para ayudar a los miembros a mejorar su alfabetización financiera y competencia financiera."
          sections={[
            { title: "1. Uso de la plataforma de membresía", body: "Al usar Edunancial, usted acepta utilizar la plataforma solo para fines personales, familiares u organizacionales aprobados y de manera legal. Puede acceder a Edunancial mediante membresías, acuerdos organizacionales aprobados o acceso beta por invitación cuando esté disponible." },
            { title: "2. Sin credencial académica o profesional", body: "La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada." },
            { title: "3. Descargo financiero, legal y fiscal", body: "Edunancial ofrece contenido únicamente informativo. Nada en la plataforma constituye asesoría legal, fiscal, contable, de inversión, de seguros, fiduciaria ni financiera, ni crea una relación profesional similar." },
            { title: "4. Cuentas y seguridad", body: "Usted es responsable de mantener la confidencialidad de sus credenciales y de toda actividad en su cuenta. Podemos suspender o revocar el acceso por fraude, abuso, uso compartido no autorizado o incumplimiento de estos Términos de uso." },
            { title: "5. Pagos y facturación", body: "El acceso de pago se concede solo después de la confirmación verificada del pago. Las membresías organizacionales aprobadas y las tarifas para organizaciones de 100+ miembros pueden requerir revisión manual, aprobación y acuerdos formales antes de que comience el acceso o la facturación." },
            { title: "6. Acceso beta", body: "El acceso beta es solo por invitación, personal para el correo aprobado, de un solo uso, revocable y limitado en duración. Consulte los Términos beta para más detalles." },
            { title: "7. Propiedad intelectual", body: "Todo el contenido, software, gráficos, evaluaciones, recursos de aprendizaje estructurados y demás materiales de la plataforma Edunancial están protegidos por las leyes de propiedad intelectual aplicables. No se concede ninguna licencia salvo su derecho limitado a acceder al servicio según su membresía." },
            { title: "8. Limitación de responsabilidad", body: "En la máxima medida permitida por la ley, Edunancial no es responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por decisiones que usted tome utilizando contenido, herramientas o resultados de la plataforma." },
          ]}
          contactLead="Las preguntas sobre estos Términos de uso pueden enviarse mediante nuestra"
          contactLink="página de contacto"
        />
      }
      fr={
        <TermsLayout
          label="Mentions légales"
          title="Conditions d'utilisation"
          updatedLabel="Dernière mise à jour"
          summaryBoxClass="border border-white/10 bg-white/5 text-slate-300"
          summaryIntro="Edunancial est une plateforme d'abonnement en littératie financière et compétence financière."
          summaryDisclaimer="Edunancial n'est pas une école, un collège, une université, un établissement de formation professionnelle, un établissement d'enseignement accrédité ni un établissement délivrant des diplômes. L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé."
          summaryMethods="Edunancial peut utiliser des parcours d'apprentissage structurés, le questionnement socratique, l'intelligence artificielle, la répétition, des cartes mémoire, des questionnaires et des exercices pratiques pour aider les membres à améliorer leur littératie financière et leur compétence financière."
          sections={[
            { title: "1. Utilisation de la plateforme d'abonnement", body: "En utilisant Edunancial, vous acceptez d'utiliser la plateforme uniquement à des fins personnelles, familiales ou organisationnelles approuvées et légales. Vous pouvez accéder à Edunancial par le biais d'abonnements, d'ententes organisationnelles approuvées ou d'un accès bêta sur invitation lorsqu'il est offert." },
            { title: "2. Aucun titre académique ou professionnel", body: "L'abonnement ne confère aucun grade académique, diplôme, licence professionnelle ni titre d'enseignement réglementé." },
            { title: "3. Avis financier, juridique et fiscal", body: "Edunancial fournit uniquement du contenu informatif. Rien sur la plateforme ne constitue un conseil juridique, fiscal, comptable, d'investissement, d'assurance, fiduciaire ou financier, et rien ne crée une relation professionnelle similaire." },
            { title: "4. Comptes et sécurité", body: "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité sur votre compte. Nous pouvons suspendre ou révoquer l'accès en cas de fraude, d'abus, de partage non autorisé ou de violation des présentes Conditions d'utilisation." },
            { title: "5. Paiements et facturation", body: "L'accès à un abonnement payant est accordé uniquement après confirmation vérifiée du paiement. Les abonnements pour organisations approuvées et les tarifs pour organisations de 100+ membres peuvent nécessiter une révision manuelle, une approbation et des ententes formelles avant le début de l'accès ou de la facturation." },
            { title: "6. Accès bêta", body: "L'accès bêta est sur invitation seulement, personnel à l'adresse e-mail approuvée, à usage unique, révocable et limité dans le temps. Consultez les Conditions bêta pour plus de détails." },
            { title: "7. Propriété intellectuelle", body: "Tout le contenu de la plateforme Edunancial, les logiciels, les graphiques, les évaluations, les ressources d'apprentissage structurées et les autres matériaux sont protégés par les lois applicables en matière de propriété intellectuelle. Aucune licence n'est accordée sauf votre droit limité d'accéder au service tel que permis par votre abonnement." },
            { title: "8. Limitation de responsabilité", body: "Dans la mesure maximale permise par la loi, Edunancial n'est pas responsable des dommages indirects, accessoires, particuliers, consécutifs ou punitifs, ni des décisions que vous prenez à l'aide du contenu, des outils ou des résultats de la plateforme." },
          ]}
          contactLead="Les questions concernant ces Conditions d'utilisation peuvent être envoyées via notre"
          contactLink="page de contact"
        />
      }
    />
  );
}
