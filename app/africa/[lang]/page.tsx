import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.africa.map((lang) => ({ lang }));
}

export default function AfricaPage({ params }: { params: { lang: Language } }) {
  return (
    <main className="px-6">
      <h1 className="text-4xl font-bold mt-10">Africa</h1>

      <CurriculumPath region="africa" />

      <CapitalismAssessment />
    </main>
  );
}
