import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage } from "@/lib/language";
import { regionContent } from "@/lib/regionContent";

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) notFound();

  return (
    <RegionCurriculum
      regionKey="asia-emerging"
      lang={params.lang}
      content={regionContent["asia-emerging"][params.lang]}
    />
  );
}
