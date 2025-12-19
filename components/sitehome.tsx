// components/sitehome.tsx
'use client';

import siteConfig from '../data/site-config';
import { getContent } from '../data/content';

type Props = {
  locale?: string;
};

export default function SiteHome({ locale }: Props) {
  const activeLocale = locale ?? siteConfig.defaultLocale;
  const content = getContent(activeLocale);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <h1>{siteConfig.siteName}</h1>
      <p>{siteConfig.tagline}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>{content.heroTitle}</h2>
        <p>{content.heroBody}</p>
      </section>
    </main>
  );
}
