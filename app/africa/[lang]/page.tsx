import RegionCurriculum from '@/components/RegionCurriculum';
import { Language } from '@/lib/regionContent';

export default function Page({ params }: { params: { lang: Language } }) {
  return <RegionCurriculum regionKey="africa" lang={params.lang} />;
}
