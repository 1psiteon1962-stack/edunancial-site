import { type Language, t } from "@/lib/i18n";

type Props = {
  lang: Language;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{t("missionTitle")}</h2>
      <p>{t("missionBody")}</p>

      <ul>
        <li>{t("pillarAccess")}</li>
        <li>{t("pillarStructure")}</li>
        <li>{t("pillarProtection")}</li>
        <li>{t("pillarScale")}</li>
      </ul>

      <p>{t("missionFooter")}</p>
    </section>
  );
}
