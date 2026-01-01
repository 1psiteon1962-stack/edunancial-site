import React from 'react';

type GlobalLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function GlobalLayout({ children, title }: GlobalLayoutProps) {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
}
