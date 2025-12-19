import React from 'react';
import siteConfig from '../data/site-config';

type PageContent = {
  heroTitle: string;
  heroBody: string;
};

type Props = {
  locale?: string;
};

function getContent(locale?: string): PageContent {
  const lang = locale ?? siteConfig.defaultLang;

  const contentMap: Record<string, PageContent> = {
    en: {
      heroTitle: 'Financial Literacy for a Global Future',
      heroBody:
        'Edunancial empowers individuals, families, and entrepreneurs with practical financial education designed to scale across borders.'
    },
    es: {
      heroTitle: 'Educación financiera para un futuro global',
      heroBody:
        'Edunancial capacita a personas, familias y emprendedores con educación financiera práctica diseñada para escalar internacionalmente.'
    }
  };

  return contentMap[lang] ?? contentMap.en;
}

export default function SiteHome({ locale }: Props) {
  const content = getContent(locale);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <section>
        <h1>{content.heroTitle}</h1>
        <p>{content.heroBody}</p>
      </section>
    </main>
  );
}
