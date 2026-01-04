import RegionCurriculum from "@/components/RegionCurriculum";
import { Language } from "@/lib/i18n";

export default function LatAmPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="latam"
      lang={params.lang}
    />
  );
}
