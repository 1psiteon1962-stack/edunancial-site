// app/asia/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function AsiaPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="asia"
      lang={params.lang}
    />
  );
}
