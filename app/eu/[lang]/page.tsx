// app/eu/[lang]/page.tsx

import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.europe.map((lang) => ({ lang }));
}

export default function EuropePage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <main className="px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Europe</h1>
      <CurriculumPath region="europe" />
      <CapitalismAssessment />
    </main>
  );
}
