import { isLanguage, type Language } from "@/lib/i18n";

type Props = {
  params: {
    lang: string;
  };
};

export default function MENAPage({ params }: Props) {
  const raw = params.lang;

  // isLanguage only takes ONE argument
  if (!isLanguage(raw)) {
    return null;
  }

  const lang: Language = raw;

  return (
    <main style={{ padding: 40 }}>
      <h1>MENA Region</h1>
      <p>Language: {lang}</p>
    </main>
  );
}
