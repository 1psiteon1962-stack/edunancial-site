// app/us/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";
import { regionContent } from "@/lib/regionContent";
import { Language } from "@/lib/language";

export default function Page({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <RegionCurriculum
      regionKey="us"
      lang={params.lang}
      content={regionContent.us[params.lang]}
    />
  );
}
