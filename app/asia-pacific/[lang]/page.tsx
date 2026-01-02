import { notFound } from 'next/navigation';
import RegionCurriculum from '@/components/RegionCurriculum';
import { Language, isLanguage } from '@/lib/language';
import { regionContent } from '@/lib/regionContent';

type PageProps = {
  params: { lang: string };
};

export default function Page({ params }: PageProps) {
  if (!isLanguage(params.lang)) {
    notFound();
  }

  const content = regionContent['asia-pacific'][params.lang];

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang as Language}
      content={content}
    />
  );
}
