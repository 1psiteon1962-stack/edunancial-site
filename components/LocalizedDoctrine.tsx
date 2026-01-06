import { Language, t } from "@/lib/i18n";

type Props = {
  lang: Language;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <article>
      <h2>{t("doctrine.title", lang)}</h2>
      <p>{t("doctrine.body", lang)}</p>
    </article>
  );
}
