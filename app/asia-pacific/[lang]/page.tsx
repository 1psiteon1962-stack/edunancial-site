import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function AsiaPacificPage() {
  return (
    <GlobalLayout title="Asia-Pacific">
      <p>
        Asia-Pacific focuses on export-driven capital, logistics efficiency,
        manufacturing discipline, and financial technology.
      </p>

      <CurriculumPath region="Asia-Pacific" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
