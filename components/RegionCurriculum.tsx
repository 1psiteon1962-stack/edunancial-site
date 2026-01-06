import { Language } from "@/lib/i18n";

export type Region =
  | "us"
  | "latam"
  | "caribbean"
  | "europe"
  | "africa"
  | "mena"
  | "asia"
  | "asia-pacific"
  | "asia-emerging";

type Props = {
  region: Region;
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
      <h1>{region.toUpperCase()} Curriculum</h1>
      <p>Language: {lang}</p>
      <p>Supported Languages: {supportedLanguages.join(", ")}</p>
    </section>
  );
}
