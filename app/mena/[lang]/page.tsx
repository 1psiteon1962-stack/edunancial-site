import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }, { lang: 'fr' }];
}

export default function MENAPage() {
  return (
    <GlobalLayout title="MENA">
      <p>
        MENA markets balance sovereign capital, infrastructure investment,
        private equity, and family-office governance.
      </p>

      <CurriculumPath region="MENA" />
      <CapitalismAssessment />
    </GlobalLayout>
  );
}
