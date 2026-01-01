import CurriculumPath, { CurriculumStep } from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import GlobalLayout from '@/components/GlobalLayout';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }, { lang: 'fr' }];
}

export default function MENAPage({
  params,
}: {
  params: { lang: string };
}) {
  const steps: CurriculumStep[] = [
    {
      title: 'Foundational Economics',
      description:
        'Understand capitalism, state influence, and market controls specific to MENA economies.',
    },
    {
      title: 'Legal & Regulatory Systems',
      description:
        'Study Sharia-compliant finance, hybrid legal systems, and cross-border compliance.',
    },
    {
      title: 'Capital Formation',
      description:
        'Learn sovereign wealth funds, family offices, and public–private investment structures.',
    },
    {
      title: 'Enterprise Scaling',
      description:
        'Explore regional expansion strategies across GCC, North Africa, and Levant markets.',
    },
  ];

  return (
    <GlobalLayout title="Middle East & North Africa">
      <main>
        <h1>MENA Economic & Business Framework</h1>

        <p>
          This curriculum is designed for entrepreneurs, investors, and operators
          working within Middle Eastern and North African markets, balancing
          innovation with regulatory, cultural, and financial realities.
        </p>

        <CurriculumPath steps={steps} />

        <CapitalismAssessment />
      </main>
    </GlobalLayout>
  );
}
