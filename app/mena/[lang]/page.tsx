// app/mena/[lang]/page.tsx

import GlobalLayout from '@/components/GlobalLayout';

/**
 * MENA Region Page
 * Supported languages are resolved by route param [lang]
 * Example routes:
 *   /mena/en
 *   /mena/es
 *   /mena/ar
 */

type Params = {
  lang: string;
};

export default function MENAPage({ params }: { params: Params }) {
  const { lang } = params;

  const copy = getCopy(lang);

  return (
    <GlobalLayout title={copy.title}>
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">{copy.heading}</h1>

        <p className="text-lg text-gray-700">
          {copy.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.tracks.map((track) => (
            <div
              key={track.title}
              className="border rounded-xl p-5 shadow-sm bg-white"
            >
              <h3 className="font-semibold text-xl mb-2">
                {track.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {track.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl bg-gray-100">
          <h2 className="text-2xl font-semibold mb-3">
            {copy.ctaTitle}
          </h2>
          <p className="text-gray-700 mb-4">
            {copy.ctaText}
          </p>
          <button className="px-6 py-3 bg-black text-white rounded-lg">
            {copy.ctaButton}
          </button>
        </div>
      </section>
    </GlobalLayout>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------- LOCALIZED COPY -------------------------- */
/* ------------------------------------------------------------------ */

function getCopy(lang: string) {
  switch (lang) {
    case 'es':
      return {
        title: 'Región MENA',
        heading: 'Educación Financiera para MENA',
        intro:
          'La región de Medio Oriente y Norte de África requiere estructuras financieras que respeten cumplimiento, capital familiar, y expansión transfronteriza.',
        tracks: [
          {
            title: 'Fundamentos Empresariales',
            description:
              'Estructuras legales, cumplimiento regional y propiedad privada.'
          },
          {
            title: 'Capital y Crecimiento',
            description:
              'Capital privado, inversiones familiares y escalamiento regional.'
          },
          {
            title: 'Expansión Global',
            description:
              'Puentes entre MENA, Europa, África y Estados Unidos.'
          }
        ],
        ctaTitle: 'Comienza tu camino',
        ctaText:
          'Accede a educación estructurada diseñada para mercados MENA.',
        ctaButton: 'Explorar Programas'
      };

    case 'ar':
      return {
        title: 'منطقة الشرق الأوسط وشمال أفريقيا',
        heading: 'التعليم المالي لمنطقة MENA',
        intro:
          'تتطلب منطقة الشرق الأوسط وشمال أفريقيا أنظمة مالية تحترم الامتثال ورأس المال العائلي والتوسع الدولي.',
        tracks: [
          {
            title: 'أساسيات الأعمال',
            description:
              'الهياكل القانونية والامتثال والملكية الخاصة.'
          },
          {
            title: 'رأس المال والنمو',
            description:
              'الاستثمار الخاص وبناء الثروة طويلة الأجل.'
          },
          {
            title: 'التوسع العالمي',
            description:
              'الربط بين MENA وأوروبا وأفريقيا والولايات المتحدة.'
          }
        ],
        ctaTitle: 'ابدأ رحلتك',
        ctaText:
          'تعليم مالي مصمم خصيصًا لأسواق MENA.',
        ctaButton: 'استكشف البرامج'
      };

    default:
      return {
        title: 'MENA Region',
        heading: 'Financial Education for MENA',
        intro:
          'The Middle East and North Africa region requires compliant, family-capital-aware, and globally connected financial structures.',
        tracks: [
          {
            title: 'Business Foundations',
            description:
              'Legal structure, compliance, and private ownership models.'
          },
          {
            title: 'Capital & Growth',
            description:
              'Private capital, family offices, and regional scaling.'
          },
          {
            title: 'Global Expansion',
            description:
              'Bridges between MENA, Europe, Africa, and the U.S.'
          }
        ],
        ctaTitle: 'Start Your Path',
        ctaText:
          'Access structured education built for MENA markets.',
        ctaButton: 'Explore Programs'
      };
  }
}
