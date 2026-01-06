// components/LocalizedDoctrine.tsx

import { t } from "@/lib/i18n";

type Props = {
  lang: string;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{t("missionTitle")}</h2>
      <p>{t("missionBody")}</p>
    </section>
  );
}
