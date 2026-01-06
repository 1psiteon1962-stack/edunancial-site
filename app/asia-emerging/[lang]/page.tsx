import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, isLanguage, REGION_LANGUAGES } from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

const REGION_KEY = "asia-emerging" as const;

export default function AsiaEmergingPage({ params }: Props) {
  const raw = params.lang;

  if (!isLanguage(raw, REGION_KEY)) {
    return notFound();
  }

  const lang: Language = raw;

  return (
    <RegionCurriculum
      region={REGION_KEY}
      lang={lang}
      supportedLanguages={REGION_LANGUAGES[REGION_KEY]}
    />
  );
}
