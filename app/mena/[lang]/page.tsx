import GlobalLayout from "@/components/GlobalLayout";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";
import { REGION_LANGUAGES, Language } from "@/lib/i18n";

/**
 * Required by Next.js for static generation of [lang]
 */
export function generateStaticParams() {
  return REGION_LANGUAGES.mena.map((lang: Language) => ({
    lang,
  }));
}

export default function MENAPage({
  params,
}: {
  params: { lang: Language };
}) {
  const { lang } = params;

  return (
    <GlobalLayout title="Middle East & North Africa">
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* HERO */}
        <section className="space-y-4">
          <h1 className="text-4xl font-bold">
            Middle East & North Africa (MENA)
          </h1>
          <p className="text-lg text-gray-700">
            The MENA region combines legacy trade networks, energy markets,
            sovereign capital, and rapidly evolving digital economies. Education
            here focuses on structured capital flows, regulatory awareness, and
            long-term asset protection.
          </p>
        </section>

        {/* DOCTRINE */}
        <LocalizedDoctrine lang={lang} />

        {/* CURRICULUM */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Curriculum Path</h2>
          <CurriculumPath />
        </section>

        {/* ASSESSMENT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Capital Systems Assessment
          </h2>
          <CapitalismAssessment />
        </section>
      </main>
    </GlobalLayout>
  );
}
