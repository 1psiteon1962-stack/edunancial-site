// app/us/[lang]/page.tsx

import RegionCurriculum from "@/components/RegionCurriculum";

export default function USPage({
  params,
}: {
  params: { lang: string };
}) {
  return <RegionCurriculum regionKey="us" lang={params.lang} />;
}
