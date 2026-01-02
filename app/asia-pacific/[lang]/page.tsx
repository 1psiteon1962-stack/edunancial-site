import RegionCurriculum from "@/components/RegionCurriculum";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";

export default function AsiaPacificPage({
  params,
}: {
  params: { lang: string };
}) {
  const content =
    regionCurriculumContent["asia-pacific"][params.lang] ??
    regionCurriculumContent["asia-pacific"].en;

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang}
      content={content}
    />
  );
}
