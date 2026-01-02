// app/europe/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang}
    />
  );
}
