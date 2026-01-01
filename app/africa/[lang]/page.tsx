import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.africa.map((lang) => ({
    lang
  }));
}

export default function AfricaPage({
  params
}: {
  params: { lang: Language };
}) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">
        Edunancial — Africa
      </h1>

      <p className="mt-4 text-lg">
        Capital clarity across diverse markets.
      </p>

      <CurriculumPath region="africa" />
      <CapitalismAssessment />
    </main>
  );
}
