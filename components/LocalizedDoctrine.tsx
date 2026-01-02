// components/LocalizedDoctrine.tsx

import { Language, resolveCopy } from '@/lib/i18n';

type DoctrineContent = {
  doctrineTitle: string;
  doctrineBody: string;
};

export default function LocalizedDoctrine({ lang }: { lang: Language }) {
  const contentMap: Record<Language, DoctrineContent> = {
    en: {
      doctrineTitle: 'Market Doctrine',
      doctrineBody: 'Markets reward discipline, patience, and structure.',
    },
    es: {
      doctrineTitle: 'Doctrina de Mercado',
      doctrineBody: 'Los mercados recompensan la disciplina y la estructura.',
    },
    fr: {
      doctrineTitle: 'Doctrine du Marché',
      doctrineBody: 'Les marchés récompensent la discipline et la structure.',
    },
    ar: {
      doctrineTitle: 'عقيدة السوق',
      doctrineBody: 'تكافئ الأسواق الانضباط والصبر والبنية.',
    },
  };

  const c = resolveCopy(lang, contentMap);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-4">{c.doctrineTitle}</h2>
      <p>{c.doctrineBody}</p>
    </section>
  );
}
