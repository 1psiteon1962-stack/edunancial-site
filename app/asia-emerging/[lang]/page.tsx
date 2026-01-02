// app/asia-emerging/[lang]/page.tsx
import RegionCurriculum from '@/components/RegionCurriculum';
import { regionContent, Language } from '@/lib/regionContent';

type PageProps = { params: { lang: Language } };

export default function Page({ params }: PageProps) {
  return (
    <RegionCurriculum
      regionKey="asia-emerging"
      lang={params.lang}
      content={regionContent['asia-emerging'][params.lang]}
    />
  );
}
