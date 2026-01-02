// app/africa/[lang]/page.tsx
import RegionCurriculum from '@/components/RegionCurriculum';
import { regionContent, Language } from '@/lib/regionContent';

type PageProps = { params: { lang: Language } };

export default function Page({ params }: PageProps) {
  return (
    <RegionCurriculum
      regionKey="africa"
      lang={params.lang}
      content={regionContent.africa[params.lang]}
    />
  );
}
