import RegionCurriculum from "@/components/RegionCurriculum";
import { Language } from "@/lib/i18n";

export default function AsiaPacificPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang}
    />
  );
}
