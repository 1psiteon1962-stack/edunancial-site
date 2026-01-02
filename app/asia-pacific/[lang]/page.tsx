// app/asia-pacific/[lang]/page.tsx
import { notFound } from 'next/navigation';
import RegionCurriculum from '@/components/RegionCurriculum';
import { regionContent } from '@/lib/regionContent';
import { isLanguage } from '@/lib/language';

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) return notFound();

  return (
    <RegionCurriculum
      regionKey="asia-pacific"
      lang={params.lang}
      content={regionContent['asia-pacific'][params.lang]}
    />
  );
}
