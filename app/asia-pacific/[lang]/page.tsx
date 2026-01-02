import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage, Language } from "@/lib/language";

type Params = {
  params: {
    lang: string;
  };
};

export default function Page({ params }: Params) {
  if (!isLanguage(params.lang)) notFound();

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang as Language}
    />
  );
}
