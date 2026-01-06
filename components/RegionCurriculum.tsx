import { Language } from "@/lib/i18n";

type Props = {
  region: string;
  lang: Language;
  supportedLanguages: readonly Language[];
};

export default function RegionCurriculum({
  region,
  lang,
  supportedLanguages,
}: Props) {
  return (
    <section>
      <h1>{region.toUpperCase()}</h1>
      <p>Language: {lang}</p>
      <p>Supported: {supportedLanguages.join(", ")}</p>
    </section>
  );
}
