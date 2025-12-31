'use client';

import Link from 'next/link';

export default function Header({
  isSpanish,
  onToggleLanguage,
}: {
  isSpanish: boolean;
  onToggleLanguage: () => void;
}) {
  return (
    <header
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/us">US</Link>
        <Link href="/latam">LATAM</Link>
        <Link href="/africa">Africa</Link>
        <Link href="/mena">MENA</Link>
        <Link href="/europe">Europe</Link>
        <Link href="/asia-pacific">Asia Pacific</Link>
        <Link href="/asia-emerging">Asia Emerging</Link>
      </nav>

      <button
        onClick={onToggleLanguage}
        style={{
          alignSelf: 'flex-start',
          padding: '0.25rem 0.75rem',
          cursor: 'pointer',
        }}
      >
        {isSpanish ? 'English' : 'Español'}
      </button>
    </header>
  );
}
