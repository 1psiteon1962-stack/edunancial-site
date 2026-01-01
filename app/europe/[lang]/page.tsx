import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'de' }, { lang: 'es' }];
}

export default function EuropePage() {
  return (
    <GlobalLayout title="Europe">
      <p>
        European capital systems emphasize compliance, longevity, institutional
        continuity, and structured risk allocation.
      </p>

      <CurriculumPath region="Europe" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
