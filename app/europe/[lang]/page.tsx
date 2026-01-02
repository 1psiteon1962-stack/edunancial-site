import RegionCurriculum from "@/components/RegionCurriculum";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  const content =
    regionCurriculumContent.europe[params.lang] ??
    regionCurriculumContent.europe.en;

  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang}
      content={content}
    />
  );
}
