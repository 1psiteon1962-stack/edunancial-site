import { Language, t } from "@/lib/i18n";

type Props = {
  lang: Language;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{t(lang, "missionTitle")}</h2>
      <p>{t(lang, "missionBody")}</p>
    </section>
  );
}
