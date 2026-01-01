// app/mena/[lang]/page.tsx

import GlobalLayout from "@/components/GlobalLayout";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";
import { REGION_LANGUAGES, Language } from "@/lib/i18n";

type PageProps = {
  params: { lang: Language };
};

/**
 * Static generation for supported MENA languages
 */
export function generateStaticParams() {
  return REGION_LANGUAGES.mena.map((lang) => ({ lang }));
}

/**
 * MENA Region Page
 * Server Component (imports client components safely)
 */
export default function MENAPage({ params }: PageProps) {
  const { lang } = params;

  return (
    <GlobalLayout title="MENA">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">
          Middle East & North Africa (MENA)
        </h1>

        <p className="text-lg">
          The MENA region operates at the intersection of energy markets,
          sovereign capital, logistics corridors, and regulatory modernization.
          Education here must align with real capital flows, compliance systems,
          and regional risk structures.
        </p>

        <CurriculumPath
          region="mena"
          lang={lang}
          stages={[
            {
              title: "Foundations",
              description:
                "Capital literacy, legal structure, and jurisdictional awareness",
            },
            {
              title: "Systems",
              description:
                "Cross-border finance, compliance, and capital controls",
            },
            {
              title: "Expansion",
              description:
                "Private equity, sovereign partnerships, and regional scaling",
            },
          ]}
        />

        <CapitalismAssessment
          region="mena"
          lang={lang}
        />
      </section>
    </GlobalLayout>
  );
}
