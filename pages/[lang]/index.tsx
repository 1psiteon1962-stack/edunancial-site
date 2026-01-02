// pages/[lang]/index.tsx

import { useRouter } from 'next/router';
import { supportedLanguages, Language } from '@/lib/i18n';
import LocalizedDoctrine from '@/components/LocalizedDoctrine';

export default function LanguageIndex() {
  const router = useRouter();
  const { lang } = router.query;

  if (!lang || !supportedLanguages.includes(lang as Language)) {
    return null;
  }

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <LocalizedDoctrine lang={lang as Language} />
    </main>
  );
}
