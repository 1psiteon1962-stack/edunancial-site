// components/LocalizedDoctrine.tsx
import { Language, resolveCopy } from '@/lib/i18n';

type DoctrineContent = {
  doctrineTitle: string;
  doctrineBody: string;
};

const contentMap: Record<Language, DoctrineContent> = {
  en: {
    doctrineTitle: 'Market Doctrine',
    doctrineBody:
      'Markets reward value creation, discipline, and long-term thinking.',
  },
  es: {
    doctrineTitle: 'Doctrina de Mercado',
    doctrineBody:
      'Los mercados recompensan la creación de valor, la disciplina y la visión a largo plazo.',
  },
  fr: {
    doctrineTitle: 'Doctrine du Marché',
    doctrineBody:
      'Les marchés récompensent la création de valeur, la discipline et la vision à long terme.',
  },
};

export default function LocalizedDoctrine({ lang }: { lang: Language }) {
  const c = resolveCopy(lang, contentMap);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{c.doctrineTitle}</h2>
      <p className="text-lg text-gray-700">{c.doctrineBody}</p>
    </section>
  );
}
