// components/LocalizedDoctrine.tsx

import { DEFAULT_LANG, isSupportedLang, t } from "@/lib/i18n";

export default function LocalizedDoctrine({ lang }: { lang?: string }) {
  const safeLang = lang && isSupportedLang(lang) ? lang : DEFAULT_LANG;

  return (
    <section>
      <h2>{t("missionTitle", safeLang)}</h2>
      <p>{t("missionBody", safeLang)}</p>
    </section>
  );
}
