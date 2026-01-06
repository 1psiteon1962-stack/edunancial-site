// components/LocalizedDoctrine.tsx

import { t } from '@/lib/translator';

export default function LocalizedDoctrine() {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{t('missionTitle')}</h2>
      <p>{t('missionBody')}</p>
    </section>
  );
}
