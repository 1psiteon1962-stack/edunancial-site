import RegionCurriculum from "@/components/RegionCurriculum";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";

export default function AfricaPage({
  params,
}: {
  params: { lang: string };
}) {
  const content =
    regionCurriculumContent.africa[params.lang] ??
    regionCurriculumContent.africa.en;

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
      content={content}
    />
  );
}
