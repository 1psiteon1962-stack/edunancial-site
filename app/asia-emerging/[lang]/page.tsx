import { Language } from '@/lib/language';
import RegionCurriculum from '@/components/RegionCurriculum';
import { regionContent } from '@/lib/regionContent';

type PageProps = {
  params: { lang: Language };
};

export default function Page({ params }: PageProps) {
  return (
    <RegionCurriculum
      regionKey="asia-emerging"
      lang={params.lang}
      content={regionContent['asia-emerging'][params.lang]}
    />
  );
}
