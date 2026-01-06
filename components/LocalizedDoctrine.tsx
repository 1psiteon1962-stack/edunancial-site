// components/LocalizedDoctrine.tsx

import { Language, t } from "@/lib/i18n";

type Props = {
  lang: Language;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">
        {t(lang, "doctrine.title")}
      </h1>

      <p className="text-lg text-gray-700">
        {t(lang, "doctrine.subtitle")}
      </p>
    </section>
  );
}
