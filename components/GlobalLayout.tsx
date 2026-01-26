import React from "react";

export type GlobalLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function GlobalLayout({
  title,
  children,
}: GlobalLayoutProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {title && (
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </header>
      )}

      <section>{children}</section>
    </main>
  );
}
