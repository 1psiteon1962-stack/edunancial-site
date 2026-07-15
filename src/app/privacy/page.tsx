import type { Metadata } from "next";
import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import { EDUNANCIAL_IDENTITY, EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";

export const metadata: Metadata = {
  title: "Privacy Policy | Edunancial",
  description:
    "Edunancial Privacy Policy — learn how we collect, use, and protect your personal information. Covers US (CCPA/CPRA), Canada (PIPEDA), and Quebec (Law 25) requirements.",
  alternates: {
    canonical: "https://www.edunancial.com/privacy",
  },
};

const lastUpdated = "July 9, 2026";

function PrivacyLayout({
  label,
  title,
  intro,
  notice,
  sections,
  identityLabel,
  disclaimerLabel,
  footerTerms,
  footerCookies,
  footerDisclaimer,
  footerTrust,
}: {
  label: string;
  title: string;
  intro: string;
  notice: string;
  sections: [string, string][];
  identityLabel: string;
  disclaimerLabel: string;
  footerTerms: string;
  footerCookies: string;
  footerDisclaimer: string;
  footerTrust: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-400">{label}</p>
        <h1 className="mb-4 text-5xl font-black">{title}</h1>
        <p className="leading-8 text-slate-300">{intro}</p>

        <div className="mt-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
          <p className="font-semibold text-blue-200">{notice}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {sections.map(([sectionTitle, body]) => (
            <div key={sectionTitle} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{sectionTitle}</h2>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300">
          <p><strong>{identityLabel}:</strong> {EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4"><strong>{disclaimerLabel}:</strong> {EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4">
            privacy@edunancial.com · <strong>Last Updated:</strong> {lastUpdated}
          </p>
        </div>

        <div className="border-t border-slate-800 pt-8 text-sm text-slate-500 mt-8">
          <p>
            <Link href="/terms" className="underline">{footerTerms}</Link>
            {" · "}
            <Link href="/cookies" className="underline">{footerCookies}</Link>
            {" · "}
            <Link href="/disclaimer" className="underline">{footerDisclaimer}</Link>
            {" · "}
            <Link href="/trust-center" className="underline">{footerTrust}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <BilingualContent
      en={
        <PrivacyLayout
          label="Legal & Compliance"
          title="Privacy Policy"
          intro="Edunancial collects only the information needed to provide membership services. We never sell your personal information. You have the right to access, correct, or delete your data. We honor requests from California residents under CCPA/CPRA, Canadian residents under PIPEDA, and Quebec residents under Law 25."
          notice="Plain-language summary: we collect account, membership, and support data only as needed to operate the service, secure the platform, and comply with applicable laws."
          sections={[
            ["What we collect", "Account registration data, country and region information, membership and billing details handled by processors, learning progress, and support communications."],
            ["How we use it", "We use personal information to deliver services, secure accounts, process payments, provide support, send transactional notices, and improve the platform."],
            ["What we do not do", "We do not sell personal information, and we do not use automated decision-making that produces legal or similarly significant effects without human review."],
            ["Your rights", "Users may request access, correction, deletion, and withdrawal of consent where applicable. California, Canadian, and Quebec residents may have additional rights under local law."],
          ]}
          identityLabel="Platform identity"
          disclaimerLabel="Public disclaimer"
          footerTerms="Terms of Use"
          footerCookies="Cookie Policy"
          footerDisclaimer="Disclaimer"
          footerTrust="Trust Center"
        />
      }
      es={
        <PrivacyLayout
          label="Legal y cumplimiento"
          title="Privacidad"
          intro="Edunancial recopila únicamente la información necesaria para ofrecer membresías, progreso de aprendizaje y soporte. No vendemos información personal y respetamos las solicitudes de acceso, corrección y eliminación de datos para miembros de Norteamérica."
          notice="Resumen claro: recopilamos datos de cuenta, membresía y soporte solo cuando son necesarios para operar el servicio, proteger la plataforma y cumplir con la ley aplicable."
          sections={[
            ["Qué recopilamos", "Datos de cuenta, preferencias, progreso, pagos verificados y solicitudes de soporte."],
            ["Cómo lo usamos", "Prestación de servicios, seguridad, soporte, pagos y mejora del producto."],
            ["Qué no hacemos", "No vendemos información personal ni activamos membresías sin verificación del servidor."],
            ["Sus opciones", "Puede solicitar acceso, corrección o eliminación de datos y retirar el consentimiento aplicable."],
          ]}
          identityLabel="Identidad de la plataforma"
          disclaimerLabel="Descargo público"
          footerTerms="Términos de uso"
          footerCookies="Política de cookies"
          footerDisclaimer="Descargo"
          footerTrust="Centro de confianza"
        />
      }
      fr={
        <PrivacyLayout
          label="Mentions légales et conformité"
          title="Politique de confidentialité"
          intro="Edunancial recueille uniquement les renseignements nécessaires pour offrir les abonnements, le suivi d'apprentissage et le support. Nous ne vendons pas de renseignements personnels et nous respectons les demandes d'accès, de correction et de suppression de données pour les membres d'Amérique du Nord."
          notice="Résumé clair : nous recueillons des données de compte, d'abonnement et de support uniquement lorsque cela est nécessaire pour exploiter le service, protéger la plateforme et respecter les lois applicables."
          sections={[
            ["Ce que nous recueillons", "Les données de compte, les préférences, la progression, les paiements vérifiés et les demandes de support."],
            ["Comment nous les utilisons", "La prestation des services, la sécurité, le support, les paiements et l'amélioration du produit."],
            ["Ce que nous ne faisons pas", "Nous ne vendons pas de renseignements personnels et nous n'activons pas d'abonnements sans vérification côté serveur."],
            ["Vos choix", "Vous pouvez demander l'accès, la correction ou la suppression de vos données et retirer votre consentement lorsque cela s'applique."],
          ]}
          identityLabel="Identité de la plateforme"
          disclaimerLabel="Avis public"
          footerTerms="Conditions d'utilisation"
          footerCookies="Politique relative aux cookies"
          footerDisclaimer="Avis de non-responsabilité"
          footerTrust="Centre de confiance"
        />
      }
    />
  );
}
