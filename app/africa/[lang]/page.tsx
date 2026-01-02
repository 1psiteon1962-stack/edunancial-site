import RegionCurriculum from "@/components/RegionCurriculum";
import { regionContent } from "@/lib/regionContent";

export default function AfricaPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
      content={regionContent.africa[params.lang]}
    />
  );
}
