'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type GlobalLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function GlobalLayout({ children, title }: GlobalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSpanish = pathname?.startsWith('/es') ?? false;

  const toggleLanguage = () => {
    if (!pathname) return;

    if (isSpanish) {
      router.push(pathname.replace('/es', ''));
    } else {
      router.push('/es' + pathname);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{title ?? 'Edunancial'}</h1>
        <button onClick={toggleLanguage}>
          {isSpanish ? 'EN' : 'ES'}
        </button>
      </header>

      <section>{children}</section>
    </main>
  );
}
