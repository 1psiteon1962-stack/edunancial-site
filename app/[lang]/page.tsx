import { notFound } from "next/navigation";
import { Language, supportedLanguages } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";

type Props = { params: { lang: string } };

export default function RootLangPage({ params }: Props) {
  if (!supportedLanguages.includes(params.lang as Language)) notFound();

  return <LocalizedDoctrine lang={params.lang as Language} />;
}

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}
