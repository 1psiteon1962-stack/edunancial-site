// app/africa/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function AfricaPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
    />
  );
}
