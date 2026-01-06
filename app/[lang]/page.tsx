import { notFound } from "next/navigation";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import {
  Language,
  SUPPORTED_LANGUAGES
} from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

/**
 * Type guard to safely narrow string → Language
 */
function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export default function RootLanguagePage({ params }: Props) {
  const raw = params.lang;

  if (!isLanguage(raw)) {
    return notFound();
  }

  const lang: Language = raw;

  return <LocalizedDoctrine lang={lang} />;
}
