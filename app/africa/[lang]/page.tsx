// app/africa/[lang]/page.tsx

import { REGION_LANGUAGES, Language } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export function generateStaticParams() {
  return REGION_LANGUAGES.africa.map((lang) => ({ lang }));
}

export default function AfricaPage({ params }: { params: { lang: Language } }) {
  return (
    <>
      <LocalizedDoctrine lang={params.lang} />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
