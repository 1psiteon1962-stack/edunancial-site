import CurriculumPath from '@/components/CurriculumPath';
import CapitalismAssessment from '@/components/CapitalismAssessment';
import LocalizedDoctrine from '@/components/LocalizedDoctrine';
import { Language } from '@/lib/i18n';

export default function MENAPage({
  params
}: {
  params: { lang: Language };
}) {
  const steps = [
    {
      title: 'Foundational Capital Literacy',
      description: 'Understanding money, ownership, and enterprise.'
    },
    {
      title: 'Legal & Cultural Constraints',
      description: 'Operating within regional norms and regulations.'
    },
    {
      title: 'Cross-Border Capital Strategy',
      description: 'Positioning for international scalability.'
    }
  ];

  return (
    <main style={{ padding: '2rem' }}>
      <h1>MENA Region</h1>

      <LocalizedDoctrine lang={params.lang} />

      <CurriculumPath
        region="mena"
        steps={steps}
      />

      <CapitalismAssessment />
    </main>
  );
}
