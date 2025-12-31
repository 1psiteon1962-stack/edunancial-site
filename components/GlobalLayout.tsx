'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
    <>
      <Header
        isSpanish={isSpanish}
        onToggleLanguage={toggleLanguage}
      />
      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {children}
      </main>
    </>
  );
}
