// app/mena/[lang]/page.tsx

import GlobalLayout from "@/components/GlobalLayout";
import CapitalismAssessment from "@/components/CapitalismAssessment";
import { REGION_LANGUAGES, Language } from "@/lib/i18n";

/**
 * Static generation for supported MENA languages
 */
export function generateStaticParams() {
  return REGION_LANGUAGES.mena.map((lang) => ({
    lang,
  }));
}

type PageProps = {
  params: {
    lang: Language;
  };
};

export default function MENAPage({ params }: PageProps) {
  const { lang } = params;

  const copy = {
    en: {
      title: "Middle East & North Africa (MENA)",
      intro:
        "The MENA region is defined by capital constraints, regulatory asymmetry, energy dominance, and rapid fintech adoption under state supervision.",
      focus: [
        "Energy finance and state-backed capital",
        "Islamic finance and compliance structures",
        "Sovereign wealth fund ecosystems",
        "Cross-border trade and remittance flows",
      ],
      path:
        "Edunancial’s MENA curriculum begins with capital literacy, governance awareness, and compliant business structuring.",
    },
    es: {
      title: "Medio Oriente y Norte de África (MENA)",
      intro:
        "La región MENA se caracteriza por restricciones de capital, asimetría regulatoria, dominio energético y rápida adopción fintech bajo supervisión estatal.",
      focus: [
        "Finanzas energéticas y capital estatal",
        "Finanzas islámicas y estructuras de cumplimiento",
        "Ecosistemas de fondos soberanos",
        "Comercio transfronterizo y remesas",
      ],
      path:
        "El currículo de Edunancial para MENA comienza con alfabetización financiera, conciencia regulatoria y estructuras empresariales compatibles.",
    },
  };

  const c = copy[lang] ?? copy.en;

  return (
    <GlobalLayout title={c.title}>
      <section className="space-y-6">
        <p className="text-lg">{c.intro}</p>

        <ul className="list-disc pl-6 space-y-2">
          {c.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="font-medium">{c.path}</p>
      </section>

      <section className="mt-10">
        <CapitalismAssessment region="mena" />
      </section>
    </GlobalLayout>
  );
}
