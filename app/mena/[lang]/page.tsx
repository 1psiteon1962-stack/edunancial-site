import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default function MENAPage({
  params,
}: {
  params: { lang: string };
}) {
  const isSpanish = params.lang === 'es';

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1>{isSpanish ? 'Región MENA' : 'MENA Region'}</h1>

      <p style={{ marginTop: '1rem' }}>
        {isSpanish
          ? 'La región MENA requiere un enfoque estratégico en preservación de capital, estructura legal y crecimiento controlado.'
          : 'The MENA region requires a strategic focus on capital preservation, legal structure, and controlled growth.'}
      </p>

      <CurriculumPath region="mena" />

      <CapitalismAssessment />
    </main>
  );
}
