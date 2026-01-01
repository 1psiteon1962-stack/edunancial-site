import GlobalLayout from "@/components/GlobalLayout";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

/**
 * Static language support for MENA
 * Keep this local to avoid i18n export conflicts
 */
export type Language = "en" | "es" | "ar" | "fr";

const SUPPORTED_LANGUAGES: Language[] = ["en", "es", "ar", "fr"];

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

/**
 * Copy resolver – local, explicit, stable
 */
function getCopy(lang: Language) {
  switch (lang) {
    case "es":
      return {
        title: "Medio Oriente y Norte de África (MENA)",
        intro:
          "La región MENA combina economías basadas en energía, comercio, infraestructura soberana y sistemas financieros en rápida modernización.",
      };
    case "ar":
      return {
        title: "الشرق الأوسط وشمال أفريقيا",
        intro:
          "تجمع منطقة الشرق الأوسط وشمال أفريقيا بين الطاقة والتجارة والبنية التحتية السيادية والأنظمة المالية المتطورة.",
      };
    case "fr":
      return {
        title: "Moyen-Orient et Afrique du Nord",
        intro:
          "La région MENA combine énergie, commerce, infrastructures souveraines et systèmes financiers en transformation.",
      };
    default:
      return {
        title: "Middle East & North Africa (MENA)",
        intro:
          "The MENA region blends energy-driven economies, trade corridors, sovereign infrastructure, and rapidly modernizing financial systems.",
      };
  }
}

export default function MENAPage({
  params,
}: {
  params: { lang: Language };
}) {
  const lang = SUPPORTED_LANGUAGES.includes(params.lang)
    ? params.lang
    : "en";

  const copy = getCopy(lang);

  return (
    <GlobalLayout title={copy.title}>
      <section className="space-y-6">
        <p className="text-lg">{copy.intro}</p>

        <CurriculumPath region="mena" lang={lang} />

        <CapitalismAssessment region="mena" lang={lang} />
      </section>
    </GlobalLayout>
  );
}
