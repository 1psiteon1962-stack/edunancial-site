import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { REGION_LANGUAGES, Language, isLanguage } from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

export default function EuropePage({ params }: Props) {
  if (!isLanguage(params.lang)) notFound();
  if (!REGION_LANGUAGES.europe.includes(params.lang as Language)) notFound();

  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang as Language}
    />
  );
}
