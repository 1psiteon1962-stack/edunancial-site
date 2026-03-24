'use client';

import dynamic from 'next/dynamic';

// ✅ Force browser-only load for HeroSlider (fixes Swiper crash)
const HeroSlider = dynamic(
  () => import('@/components/home/HeroSlider'),
  { ssr: false }
);

// ✅ If you have other sections, import them normally
// (add more as needed — safe to leave even if unused)
import React from 'react';

export default function HomePage() {
  return (
    <main>
      <HeroSlider />

      {/* Safe fallback content to prevent empty render */}
      <section style={{ padding: 40 }}>
        <h1>Edunancial</h1>
        <p>Building financial literacy globally.</p>
      </section>
    </main>
  );
}
