import RegionCurriculum from "@/components/RegionCurriculum";
import { europeContent } from "@/lib/regionContent/europe";

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  const content =
    europeContent[params.lang] ?? europeContent.en;

  return (
    <RegionCurriculum
      regionKey="europe"
      lang={params.lang}
      content={content}
    />
  );
}
