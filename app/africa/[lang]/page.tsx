import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }];
}

export default function AfricaPage({ params }: { params: { lang: string } }) {
  return (
    <GlobalLayout title="Africa">
      <p>
        African markets prioritize resilience, infrastructure growth,
        cross-border trade, and capital formation under constraint.
      </p>

      <CurriculumPath region="Africa" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
