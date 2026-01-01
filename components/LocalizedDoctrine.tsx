import { Language, resolveCopy } from '@/lib/i18n';

type DoctrineContent = {
  doctrineTitle: string;
  doctrineBody: string;
};

const contentMap: Record<Language, DoctrineContent> = {
  en: {
    doctrineTitle: 'Market Doctrine',
    doctrineBody:
      'This region emphasizes structured capital flow, legal clarity, and scalable systems.'
  },
  es: {
    doctrineTitle: 'Doctrina de Mercado',
    doctrineBody:
      'Esta región enfatiza el flujo de capital estructurado, claridad legal y sistemas escalables.'
  },
  pt: {
    doctrineTitle: 'Doutrina de Mercado',
    doctrineBody:
      'Esta região enfatiza fluxo de capital estruturado, clareza jurídica e sistemas escaláveis.'
  }
};

export default function LocalizedDoctrine({ lang }: { lang: Language }) {
  const c = resolveCopy(lang, contentMap);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{c.doctrineTitle}</h2>
      <p>{c.doctrineBody}</p>
    </section>
  );
}
