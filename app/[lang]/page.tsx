import { notFound } from "next/navigation";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import {
  Language,
  SUPPORTED_LANGUAGES
} from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

export default function RootLanguagePage({ params }: Props) {
  const raw = params.lang;

  if (!SUPPORTED_LANGUAGES.includes(raw as Language)) {
    return notFound();
  }

  const lang: Language = raw;

  return <LocalizedDoctrine lang={lang} />;
}
