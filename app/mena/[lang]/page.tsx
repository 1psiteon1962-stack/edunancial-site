// app/mena/[lang]/page.tsx

import GlobalLayout from "@/components/GlobalLayout";
import CapitalismAssessment from "@/components/CapitalismAssessment";

/**
 * We intentionally do NOT import CurriculumPath here.
 * That component has casing conflicts on Linux/Netlify.
 * Curriculum content is rendered inline instead.
 */

type Language = "en" | "es" | "fr" | "ar";

const COPY: Record<Language, { title: string; intro: string }> = {
  en: {
    title: "Middle East & North Africa (MENA)",
    intro:
      "The MENA region combines sovereign capital, energy economics, family offices, and rapidly evolving regulatory environments. Edunancial’s curriculum here focuses on capital structure, compliance awareness, and cross-border strategy.",
  },
  es: {
    title: "Medio Oriente y Norte de África (MENA)",
    intro:
      "La región MENA combina capital soberano, economía energética, oficinas familiares y marcos regulatorios en rápida evolución. El enfoque educativo aquí es estructura de capital, cumplimiento y estrategia transfronteriza.",
  },
  fr: {
    title: "Moyen-Orient et Afrique du Nord (MENA)",
    intro:
      "La région MENA combine capitaux souverains, économie énergétique et structures réglementaires complexes. Le programme se concentre sur la structure du capital et la conformité.",
  },
  ar: {
    title: "الشرق الأوسط وشمال أفريقيا",
    intro:
      "تجمع منطقة الشرق الأوسط وشمال أفريقيا بين رأس المال السيادي واقتصاد الطاقة والحوكمة التنظيمية. يركز المنهج على هيكلة رأس المال والامتثال.",
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }, { lang: "fr" }, { lang: "ar" }];
}

export default function MENAPage({
  params,
}: {
  params: { lang: Language };
}) {
  const lang: Language = COPY[params.lang] ? params.lang : "en";
  const content = COPY[lang];

  return (
    <GlobalLayout title={content.title}>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

        <p className="text-lg text-gray-700 mb-10">
          {content.intro}
        </p>

        {/* ===== Curriculum Overview (INLINE – no shared component) ===== */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Foundation</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Financial literacy</li>
              <li>• Legal entities & ownership</li>
              <li>• Risk and compliance basics</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Growth</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Capital stacking</li>
              <li>• Regional deal structures</li>
              <li>• Partner and family-office alignment</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Advanced</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Cross-border expansion</li>
              <li>• Energy & infrastructure finance</li>
              <li>• Governance and exit planning</li>
            </ul>
          </div>
        </div>

        {/* ===== Assessment (Client Component) ===== */}
        <CapitalismAssessment />
      </section>
    </GlobalLayout>
  );
}
