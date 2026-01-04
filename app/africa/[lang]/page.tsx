import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { REGION_LANGUAGES, Language, isLanguage } from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

export default function AfricaPage({ params }: Props) {
  if (!isLanguage(params.lang)) notFound();
  if (!REGION_LANGUAGES.africa.includes(params.lang as Language)) notFound();

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang as Language}
    />
  );
}
