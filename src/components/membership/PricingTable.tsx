"use client";

import Link from "next/link";

import { useNorthAmericaLaunchLanguage } from "@/components/international/BilingualContent";
import { EDUNANCIAL_CERTIFICATE_DISCLAIMER } from "@/lib/positioning";
import { getMembershipFeatureLabel, getMembershipPlanCopy } from "@/lib/membershipCopy";
import { publicMembershipPlans } from "@/types/membership";

const copy = {
  feature: { en: "Feature", es: "Característica", "fr-CA": "Fonctionnalité", "fr-FR": "Fonctionnalité" },
  contactUs: { en: "Contact Us", es: "Contáctenos", "fr-CA": "Nous contacter", "fr-FR": "Nous contacter" },
  select: { en: "Select", es: "Seleccionar", "fr-CA": "Sélectionner", "fr-FR": "Sélectionner" },
  certificateDisclaimer: {
    en: EDUNANCIAL_CERTIFICATE_DISCLAIMER,
    es: "Este certificado reconoce la finalización de un módulo de alfabetización financiera o competencia financiera de Edunancial. No es un título académico, licencia profesional, credencial regulada ni prueba de acreditación.",
    "fr-CA": "Ce certificat reconnaît l'achèvement d'un module de littératie financière ou de compétence financière d'Edunancial. Il ne constitue pas un diplôme académique, une licence professionnelle, un titre réglementé ni une preuve d'accréditation.",
    "fr-FR": "Ce certificat reconnaît l'achèvement d'un module de littératie financière ou de compétence financière d'Edunancial. Il ne constitue pas un diplôme académique, une licence professionnelle, un titre réglementé ni une preuve d'accréditation.",
  },
} as const;

export default function PricingTable() {
  const language = useNorthAmericaLaunchLanguage();
  const t = <K extends keyof typeof copy>(key: K) => copy[key][language] ?? copy[key].en;

  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-5 text-left text-lg font-bold">{t("feature")}</th>
            {publicMembershipPlans.map((plan) => {
              const membershipCopy = getMembershipPlanCopy(plan.id, language);

              return (
                <th key={plan.id} className="px-6 py-5 text-center">
                  <div className="text-2xl font-bold">{membershipCopy.name}</div>
                  <div className="mt-2 text-3xl font-bold text-blue-700">${plan.monthlyPrice.toFixed(2)}</div>
                  <div className="text-sm text-slate-500">{membershipCopy.billingLabel}</div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          <PricingRow
            title={getMembershipFeatureLabel("assessmentIncluded", language)}
            values={publicMembershipPlans.map((plan) => plan.assessmentIncluded)}
          />
          <PricingRow
            title={getMembershipFeatureLabel("marketplaceIncluded", language)}
            values={publicMembershipPlans.map((plan) => plan.marketplaceIncluded)}
          />
          <PricingRow
            title={getMembershipFeatureLabel("aiCoachIncluded", language)}
            values={publicMembershipPlans.map((plan) => plan.aiCoachIncluded)}
          />
          <PricingRow
            title={getMembershipFeatureLabel("downloadableCourses", language)}
            values={publicMembershipPlans.map((plan) => plan.downloadableCourses)}
          />
          <PricingRow
            title={getMembershipFeatureLabel("prioritySupport", language)}
            values={publicMembershipPlans.map((plan) => plan.prioritySupport)}
          />

          <tr className="border-t">
            <td className="px-6 py-5 font-semibold">{getMembershipFeatureLabel("maxCertificates", language)}</td>
            {publicMembershipPlans.map((plan) => (
              <td key={plan.id} className="text-center">
                {plan.maxCertificates}
              </td>
            ))}
          </tr>

          <tr className="border-t">
            <td />
            {publicMembershipPlans.map((plan) => (
              <td key={plan.id} className="p-6 text-center">
                <Link
                  href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
                  className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  {plan.showContactOnly ? t("contactUs") : t("select")}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="border-t border-slate-200 px-6 py-5 text-sm leading-7 text-slate-600">
        {t("certificateDisclaimer")}
      </div>
    </section>
  );
}

interface PricingRowProps {
  title: string;
  values: boolean[];
}

function PricingRow({ title, values }: PricingRowProps) {
  return (
    <tr className="border-t">
      <td className="px-6 py-5 font-semibold">{title}</td>
      {values.map((value, index) => (
        <td key={index} className="text-center text-lg">
          {value ? "✓" : "—"}
        </td>
      ))}
    </tr>
  );
}
