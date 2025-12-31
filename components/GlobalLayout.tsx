'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function GlobalLayout({ title, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Null-safe language detection
  const isSpanish = pathname?.startsWith('/es') ?? false;

  const toggleLanguage = () => {
    if (!pathname) return;

    if (isSpanish) {
      router.push(pathname.replace('/es', '') || '/');
    } else {
      router.push('/es' + pathname);
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* GLOBAL REGION NAV */}
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Regions:&nbsp;
        <a href="/us">US</a> |{' '}
        <a href="/latam">LATAM</a> |{' '}
        <a href="/africa">Africa</a> |{' '}
        <a href="/mena">MENA</a> |{' '}
        <a href="/europe">Europe</a> |{' '}
        <a href="/asia-pacific">Asia-Pacific</a> |{' '}
        <a href="/asia-emerging">Emerging Asia</a>
      </nav>

      {/* LANGUAGE TOGGLE */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={toggleLanguage}
          style={{
            fontSize: '0.85rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer'
          }}
        >
          {isSpanish ? 'View in English' : 'Ver en Español'}
        </button>
      </div>

      {title && <h1>{title}</h1>}

      {children}
    </main>
  );
}
