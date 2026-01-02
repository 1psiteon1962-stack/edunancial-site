import RegionCurriculum from '@/components/RegionCurriculum';
import { europeCurriculumContent } from '@/lib/curriculumContent/europe';

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  const content =
    europeCurriculumContent[params.lang] ??
    europeCurriculumContent.en;

  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang}
      content={content}
    />
  );
}
