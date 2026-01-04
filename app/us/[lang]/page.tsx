import RegionCurriculum from "@/components/RegionCurriculum";
import { Language } from "@/lib/i18n";

export default function USPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="us"
      lang={params.lang}
    />
  );
}
