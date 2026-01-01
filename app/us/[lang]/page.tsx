import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default function USPage({ params }: { params: { lang: string } }) {
  return (
    <GlobalLayout title="United States">
      <p>
        The U.S. market emphasizes transparency, regulation, scale efficiency,
        and structured capital deployment.
      </p>

      <CurriculumPath region="United States" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
