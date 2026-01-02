// app/africa/[lang]/page.tsx
import { notFound } from 'next/navigation';
import RegionCurriculum from '@/components/RegionCurriculum';
import { regionContent } from '@/lib/regionContent';
import { isLanguage } from '@/lib/language';

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) return notFound();

  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
      content={regionContent.africa[params.lang]}
    />
  );
}
