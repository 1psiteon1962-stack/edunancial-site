import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import { REGION_LANGUAGES, Language } from '@/lib/i18n';

export function generateStaticParams() {
  return REGION_LANGUAGES.africa.map((lang) => ({ lang }));
}

export default function AfricaPage({
  params,
}: {
  params: { lang: Language };
}) {
  const steps = [
    {
      title: 'Foundational Capital Literacy',
      description:
        'Understanding capital flows, trade, and financial systems across African markets.',
    },
    {
      title: 'Regional Market Structures',
      description:
        'How informal and formal economies interact across borders.',
    },
    {
      title: 'Execution & Scale',
      description:
        'Moving from subsistence activity to scalable enterprise.',
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold">Edunancial — Africa</h1>

      <p className="mt-4 text-gray-700">
        Capital clarity across diverse markets. Africa is not one economy.
      </p>

      <CurriculumPath steps={steps} />
      <CapitalismAssessment />
    </main>
  );
}
