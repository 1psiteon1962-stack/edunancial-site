// pages/africa/[lang]/index.tsx

import { supportedLanguages } from "@/lib/i18n";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";

export async function getStaticPaths() {
  return {
    paths: supportedLanguages.map((lang) => ({
      params: { lang },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      lang: params.lang,
    },
  };
}

export default function AfricaHome({ lang }: { lang: string }) {
  return (
    <>
      <LocalizedDoctrine lang={lang} region="africa" />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
