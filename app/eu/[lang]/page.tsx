// app/eu/[lang]/page.tsx

import { REGION_LANGUAGES, resolveCopy, Language } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export function generateStaticParams() {
  return REGION_LANGUAGES.eu.map((lang) => ({ lang }));
}

export default function EuropePage({ params }: { params: { lang: Language } }) {
  return (
    <>
      <LocalizedDoctrine lang={params.lang} />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
