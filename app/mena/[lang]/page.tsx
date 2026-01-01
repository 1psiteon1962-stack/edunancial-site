// app/mena/[lang]/page.tsx

import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

type PageProps = {
  params: {
    lang: Language;
  };
};

/**
 * Static language generation for MENA
 */
export function generateStaticParams() {
  return (REGION_LANGUAGES.mena || ['en']).map((lang) => ({
    lang,
  }));
}

export default function MENAPage({ params }: PageProps) {
  const { lang } = params;

  return (
    <GlobalLayout title="Middle East & North Africa">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">
          Middle East & North Africa (MENA)
        </h1>

        <p className="text-lg">
          The MENA region operates at the intersection of capital discipline,
          sovereign influence, family offices, and cross-border trade.
          Education here focuses on structural leverage, compliance, and
          generational capital preservation.
        </p>

        <p>
          Markets across the Middle East and North Africa emphasize
          relationship-driven transactions, regulatory awareness, and long-term
          asset positioning — particularly in energy, infrastructure, logistics,
          fintech, and real estate.
        </p>
      </section>

      <section className="mt-10">
        <CurriculumPath
          region="mena"
          lang={lang}
        />
      </section>

      <section className="mt-10">
        <CapitalismAssessment
          region="mena"
          lang={lang}
        />
      </section>
    </GlobalLayout>
  );
}
