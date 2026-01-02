import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage } from "@/lib/language";
import { regionContent } from "@/lib/regionContent";

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) notFound();

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
      content={regionContent.africa[params.lang]}
    />
  );
}
