// app/mena/[lang]/page.tsx

import GlobalLayout from "@/components/GlobalLayout";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";
import { REGION_LANGUAGES, Language } from "@/lib/i18n";

/**
 * Static params for all supported MENA languages
 * This MUST exist for App Router + Netlify
 */
export function generateStaticParams() {
  return REGION_LANGUAGES.mena.map((lang) => ({ lang }));
}

type PageProps = {
  params: {
    lang: Language;
  };
};

export default function MENAPage({ params }: PageProps) {
  const { lang } = params;

  return (
    <GlobalLayout title="MENA">
      {/* Intro Section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">
          Middle East & North Africa (MENA)
        </h1>

        <p className="text-lg">
          The MENA region presents unique opportunities shaped by energy markets,
          sovereign capital, infrastructure expansion, fintech regulation,
          and cross-border commerce. Education here must respect legal systems,
          religious frameworks, and capital-control realities while still
          enabling scalable entrepreneurship.
        </p>
      </section>

      {/* Curriculum Path (SHARED COMPONENT — DO NOT DUPLICATE) */}
      <section className="mt-10">
        <CurriculumPath
          region="mena"
          language={lang}
        />
      </section>

      {/* Assessment (CLIENT COMPONENT — SAFE TO USE HERE) */}
      <section className="mt-12">
        <CapitalismAssessment
          region="mena"
          language={lang}
        />
      </section>
    </GlobalLayout>
  );
}
