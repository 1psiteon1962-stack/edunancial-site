// app/asia-pacific/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function AsiaPacificPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang}
    />
  );
}
