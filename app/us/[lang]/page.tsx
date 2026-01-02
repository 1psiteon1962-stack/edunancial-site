// app/us/[lang]/page.tsx

import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage } from "@/lib/language";

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLanguage(params.lang)) {
    notFound();
  }

  return (
    <RegionCurriculum
      regionKey="us"
      lang={params.lang}
    />
  );
}
