import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES['asia-emerging'].map((lang) => ({ lang }));
}

export default function AsiaEmergingPage({
  params,
}: {
  params: { lang: Language };
}) {
  const steps = [
    {
      title: 'Transition Economies',
      description:
        'Moving from informal systems to structured capital.',
    },
    {
      title: 'Institutional Trust',
      description:
        'Building systems that attract outside investment.',
    },
    {
      title: 'Market Readiness',
      description:
        'Preparing enterprises for cross-border capital.',
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold">
        Edunancial — Emerging Asia
      </h1>

      <CurriculumPath steps={steps} />
      <CapitalismAssessment />
    </main>
  );
}
