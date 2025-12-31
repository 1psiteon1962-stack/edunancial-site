// pages/[lang]/index.tsx

import { useRouter } from "next/router";
import { supportedLanguages } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export async function getStaticPaths() {
  return {
    paths: supportedLanguages.map((lang) => ({ params: { lang } })),
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

export default function LocalizedHome({ lang }: { lang: any }) {
  return (
    <>
      <LocalizedDoctrine lang={lang} />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
