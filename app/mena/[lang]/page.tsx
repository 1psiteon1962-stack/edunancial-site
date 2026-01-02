import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage, Language } from "@/lib/language";
import { regionContent } from "@/lib/regionContent";

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLanguage(params.lang)) return notFound();

  const lang: Language = params.lang;
  const content = regionContent.mena[lang];

  if (!content) return notFound();

  return (
    <RegionCurriculum
      regionKey="mena"
      lang={lang}
      content={content}
    />
  );
}
