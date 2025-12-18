import React from 'react';

import {
  HeroSection,
  StorySection,
  CoursesSection,
  AppsSection,
  RotatingVideoSection,
  FooterSection,
  BooksSection
} from './sections';

import siteConfig from '../data/site-config';

export default function SiteHome() {
  // We keep this file dependency explicit so Netlify/Next can typecheck cleanly.
  // If your individual section components render their own content, this will still work.
  // If they are minimal shells, the config text below ensures the page is never “empty”.
  return (
    <main>
      {/* If your HeroSection already renders content, this still renders fine. */}
      <HeroSection />

      {/* Optional fallback content if sections are minimal */}
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>{siteConfig.hero.title}</h1>
        <p style={{ fontSize: 18, marginTop: 10 }}>{siteConfig.hero.subtitle}</p>
      </section>

      <StorySection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>{siteConfig.story.heading}</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>{siteConfig.story.body}</p>
      </section>

      <BooksSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>{siteConfig.books.heading}</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>{siteConfig.books.body}</p>
      </section>

      <CoursesSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>{siteConfig.courses.heading}</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>{siteConfig.courses.body}</p>
      </section>

      <AppsSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>{siteConfig.apps.heading}</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>{siteConfig.apps.body}</p>
      </section>

      <RotatingVideoSection />

      <FooterSection />
      <footer style={{ padding: '24px 16px', textAlign: 'center' }}>
        <small>{siteConfig.footer.copyright}</small>
      </footer>
    </main>
  );
}
