import { notFound } from 'next/navigation';
import RegionCurriculum from '@/components/RegionCurriculum';
import { isLanguage, type Language } from '@/lib/language';
import { regionContent } from '@/lib/regionContent';

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLanguage(params.lang)) return notFound();
  const lang = params.lang as Language;

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={lang}
      content={regionContent.africa[lang]}
    />
  );
}
