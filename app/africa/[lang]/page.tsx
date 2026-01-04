import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, REGION_LANGUAGES } from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

export default function AfricaPage({ params }: Props) {
  if (!REGION_LANGUAGES.africa.includes(params.lang as Language)) {
    notFound();
  }

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang as Language}
    />
  );
}
