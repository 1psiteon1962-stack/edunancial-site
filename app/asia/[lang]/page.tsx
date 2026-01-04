import RegionCurriculum from "@/components/RegionCurriculum";
import { Language } from "@/lib/i18n";

export default function AsiaPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="asia"
      lang={params.lang}
    />
  );
}
