import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, isLanguage, REGION_LANGUAGES } from "@/lib/i18n";

type Props = { params: { lang: string } };
const REGION = "europe" as const;

export default function EuropePage({ params }: Props) {
  const raw = params.lang;
  if (!isLanguage(raw, REGION)) return notFound();

  const lang: Language = raw;

  return (
    <RegionCurriculum
      region={REGION}
      lang={lang}
      supportedLanguages={REGION_LANGUAGES[REGION]}
    />
  );
}
