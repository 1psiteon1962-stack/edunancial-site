import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { regionContent } from "@/lib/regionContent";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/languages";

const isLanguage = (value: string): value is Language =>
  SUPPORTED_LANGUAGES.includes(value as Language);

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLanguage(params.lang)) {
    notFound();
  }

  const content = regionContent["asia-pacific"][params.lang];

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang}
      content={content}
    />
  );
}
