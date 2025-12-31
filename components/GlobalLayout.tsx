'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function GlobalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isSpanish = pathname.startsWith('/es');

  const toggleLanguage = () => {
    if (isSpanish) {
      router.push(pathname.replace('/es', '') || '/');
    } else {
      router.push('/es' + pathname);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <strong>Regions:</strong>{' '}
        <a href="/us">US</a> |{' '}
        <a href="/latam">LATAM</a> |{' '}
        <a href="/africa">Africa</a> |{' '}
        <a href="/mena">MENA</a> |{' '}
        <a href="/europe">Europe</a> |{' '}
        <a href="/asia-pacific">Asia-Pacific</a> |{' '}
        <a href="/asia-emerging">Emerging Asia</a>
        <span style={{ float: 'right' }}>
          <button
            onClick={toggleLanguage}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {isSpanish ? 'EN' : 'ES'}
          </button>
        </span>
      </nav>

      <h1>{title}</h1>

      <main>{children}</main>
    </div>
  );
}
