import LocalizedDoctrine from "./LocalizedDoctrine";
import { Language, Region } from "@/lib/i18n";

type Props = {
  region: Region;
  lang: Language;
};

export default function RegionCurriculum({ region, lang }: Props) {
  return (
    <main>
      <h1>{region.toUpperCase()}</h1>
      <LocalizedDoctrine lang={lang} />
    </main>
  );
}
