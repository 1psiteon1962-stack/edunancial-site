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

/**
 * IMPORTANT:
 * - This file intentionally has ZERO external data imports.
 * - This guarantees Netlify can always compile this page.
 * - Configuration can be reintroduced later via CMS, env, or API.
 */

export default function SiteHome() {
  return (
    <main>

      {/* HERO */}
      <HeroSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>
          Financial Literacy for the Real World
        </h1>
        <p style={{ fontSize: 18, marginTop: 10 }}>
          Education, structure, and strategy for building wealth across borders.
        </p>
      </section>

      {/* STORY */}
      <StorySection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>Our Story</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>
          Edunancial was built to close the gap between education and real financial opportunity.
        </p>
      </section>

      {/* BOOKS */}
      <BooksSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>Books</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>
          Practical guides and frameworks designed for real-world wealth building.
        </p>
      </section>

      {/* COURSES */}
      <CoursesSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>Courses</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>
          Structured learning paths for business, investing, and global finance.
        </p>
      </section>

      {/* APPS */}
      <AppsSection />
      <section style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, margin: 0 }}>Apps</h2>
        <p style={{ fontSize: 16, marginTop: 10 }}>
          Interactive tools to assess, plan, and grow your financial literacy.
        </p>
      </section>

      {/* MEDIA */}
      <RotatingVideoSection />

      {/* FOOTER */}
      <FooterSection />
      <footer style={{ padding: '24px 16px', textAlign: 'center' }}>
        <small>© {new Date().getFullYear()} Edunancial. All rights reserved.</small>
      </footer>

    </main>
  );
}
