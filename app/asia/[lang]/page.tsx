import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.asia.map((lang) => ({ lang }));
}

export default function AsiaPage({
  params,
}: {
  params: { lang: Language };
}) {
  const steps = [
    {
      title: 'Capital Efficiency',
      description:
        'High-growth systems, export-driven economies, and capital velocity.',
    },
    {
      title: 'Industrial Strategy',
      description:
        'Government-backed growth and private sector alignment.',
    },
    {
      title: 'Global Integration',
      description:
        'Participating in global capital markets.',
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold">Edunancial — Asia</h1>

      <CurriculumPath steps={steps} />
      <CapitalismAssessment />
    </main>
  );
}
