import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.asia.map((lang) => ({ lang }));
}

export default function AsiaPage({
  params
}: {
  params: { lang: Language };
}) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">
        Edunancial — Asia
      </h1>

      <CurriculumPath region="asia" />
      <CapitalismAssessment />
    </main>
  );
}
