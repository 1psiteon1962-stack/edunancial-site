import RegionCurriculum from "@/components/RegionCurriculum";
import { Language } from "@/lib/i18n";

export default function MenaPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="mena"
      lang={params.lang}
    />
  );
}
