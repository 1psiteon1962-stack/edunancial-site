import RegionCurriculum from "@/components/RegionCurriculum";
import { regionContent } from "@/lib/regionContent";

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang}
      content={regionContent.europe[params.lang]}
    />
  );
}
