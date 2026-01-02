// app/africa/[lang]/page.tsx

import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import LocalizedDoctrine from '@/components/LocalizedDoctrine';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.africa.map((lang) => ({ lang }));
}

export default function AfricaPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Africa</h1>

      <LocalizedDoctrine lang={params.lang} />

      <CurriculumPath
        region="africa"
        steps={[
          {
            title: 'Foundations',
            description: 'Understanding markets and ownership.',
          },
          {
            title: 'Capital',
            description: 'Accessing and structuring capital responsibly.',
          },
        ]}
      />

      <CapitalismAssessment />
    </main>
  );
}
