// app/asia-emerging/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function AsiaEmergingPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="asia-emerging"
      lang={params.lang}
    />
  );
}
