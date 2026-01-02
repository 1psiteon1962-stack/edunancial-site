import { notFound } from 'next/navigation';
import RegionCurriculum from '@/components/RegionCurriculum';
import { isLanguage, Language } from '@/lib/languages';
import { regionContent } from '@/lib/regionContent';

type PageProps = {
  params: {
    lang: string;
  };
};

export default function Page({ params }: PageProps) {
  if (!isLanguage(params.lang)) {
    return notFound();
  }

  const lang: Language = params.lang;
  const content = regionContent['asia-pacific'][lang];

  if (!content) {
    return notFound();
  }

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={lang}
      content={content}
    />
  );
}
