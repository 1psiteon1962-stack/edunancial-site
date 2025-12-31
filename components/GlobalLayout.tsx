'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type GlobalLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function GlobalLayout({ children, title }: GlobalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSpanish = pathname?.startsWith('/es') ?? false;

  const toggleLanguage = () => {
    if (!pathname) return;

    if (isSpanish) {
      router.push(pathname.replace('/es', '') || '/');
    } else {
      router.push(`/es${pathname}`);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <strong>Regions:</strong>{' '}
        <Link href="/us">US</Link> |{' '}
        <Link href="/latam">LATAM</Link> |{' '}
        <Link href="/africa">Africa</Link> |{' '}
        <Link href="/mena">MENA</Link> |{' '}
        <Link href="/europe">Europe</Link> |{' '}
        <Link href="/asia-pacific">Asia-Pacific</Link> |{' '}
        <Link href="/asia-emerging">Asia-Emerging</Link>
        <span style={{ float: 'right' }}>
          <button onClick={toggleLanguage}>
            {isSpanish ? 'English' : 'Español'}
          </button>
        </span>
      </nav>

      {title && <h1>{title}</h1>}

      <main>{children}</main>

      <footer style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#666' }}>
        Edunancial is a platform operated under license from Caban International Holdings, Inc.
      </footer>
    </div>
  );
}
