import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function AsiaEmergingPage() {
  return (
    <GlobalLayout title="Emerging Asia">
      <p>
        Emerging Asian markets emphasize mobility, entrepreneurship,
        digital-first capital access, and regulatory navigation.
      </p>

      <CurriculumPath region="Emerging Asia" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
