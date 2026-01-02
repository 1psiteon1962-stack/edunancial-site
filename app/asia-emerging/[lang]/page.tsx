import RegionCurriculum from "@/components/RegionCurriculum";
import { regionContent } from "@/lib/regionContent";

export default function AsiaEmergingPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="asia-emerging"
      lang={params.lang}
      content={regionContent["asia-emerging"][params.lang]}
    />
  );
}
