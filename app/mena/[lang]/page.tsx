// app/mena/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function MENAPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <RegionCurriculum
      regionKey="mena"
      lang={params.lang}
    />
  );
}
