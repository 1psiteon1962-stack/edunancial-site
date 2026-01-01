// app/africa/[lang]/page.tsx
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import { Language } from "@/lib/i18n";

export default function AfricaPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <>
      <LocalizedDoctrine lang={params.lang} />
      <CurriculumPath />
    </>
  );
}
