import GlobalLayout from '@/components/GlobalLayout';
import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

type PageProps = {
  params: {
    lang: string;
  };
};

export default function MENAPage({ params }: PageProps) {
  const isSpanish = params.lang === 'es';

  return (
    <GlobalLayout title={isSpanish ? 'Región MENA' : 'MENA Region'}>
      <p>
        {isSpanish
          ? 'La región MENA requiere una comprensión profunda del capital, la regulación y la expansión transfronteriza.'
          : 'The MENA region requires a deep understanding of capital, regulation, and cross-border expansion.'}
      </p>

      <CurriculumPath region="mena" />

      <CapitalismAssessment />
    </GlobalLayout>
  );
}
